@file:JvmName("BlockYouTubeAds")

package me.palmdevs.revenge.blockyoutubeads

import android.os.Build
import android.webkit.WebView
import de.robv.android.xposed.XC_MethodHook
import de.robv.android.xposed.XposedBridge
import io.github.revenge.plugins.plugin
import java.io.File
import java.lang.reflect.InvocationHandler
import java.util.WeakHashMap

private const val USERSCRIPT = "assets/adguard.js"

private val ALLOWED_ORIGINS = arrayOf(
    "https://www.youtube.com",
    "https://m.youtube.com",
    "https://music.youtube.com",
    "https://www.youtube-nocookie.com",
)

/** [WebView] methods that start a navigation. The script is registered before the first one runs. */
private val LOAD_METHODS = arrayOf("loadUrl", "loadData", "loadDataWithBaseURL", "postUrl")

/**
 * Injects the userscript into every YouTube frame of every [WebView], at document start.
 *
 * The React Native WebView props only inject into the main frame on Android,
 * but Discord's player embeds YouTube in an iframe, so this goes through WebView's document start scripts instead.
 */
@Suppress("UNUSED")
val blockYouTubeAds = plugin {
    val scripts = WeakHashMap<WebView, InvocationHandler>()
    var unhooks = emptySet<XC_MethodHook.Unhook>()

    start {
        val script = File(pluginDir, USERSCRIPT).bufferedReader()
            .use { wrapUserscript(it.readText()) }

        var api: DocumentStartScripts? = null
        var failed = false

        val hook = object : XC_MethodHook() {
            override fun beforeHookedMethod(param: MethodHookParam) {
                val webView = param.thisObject as WebView
                if (failed || webView in scripts) return

                try {
                    val documentStartScripts = api ?: DocumentStartScripts().also { api = it }
                    if (!documentStartScripts.supported) {
                        failed = true
                        log.w("This WebView does not support document start scripts, YouTube ads will not be blocked")
                        return
                    }

                    scripts[webView] = documentStartScripts.add(webView, script, ALLOWED_ORIGINS)
                } catch (e: Throwable) {
                    failed = true
                    log.e("Failed to add the userscript to a WebView", e)
                    errors.tryEmit(e)
                }
            }
        }

        unhooks = LOAD_METHODS.flatMapTo(mutableSetOf()) {
            XposedBridge.hookAllMethods(WebView::class.java, it, hook)
        }
    }

    stop {
        unhooks.forEach { it.unhook() }
        unhooks = emptySet()

        // WebView must be called from its own thread.
        scripts.forEach { (webView, handler) ->
            webView.post {
                runCatching { DocumentStartScripts.remove(handler) }
                    .onFailure { log.e("Failed to remove the userscript from a WebView", it) }
            }
        }
        scripts.clear()
    }
}

/** Wraps the script to run at the start of each document, before `document.head` exists. */
private fun wrapUserscript(userscript: String) = """
    (() => {
        const run = () => {
            $userscript
        }

        if (document.head) return run()

        const observer = new MutationObserver(() => {
            if (!document.head) return
            observer.disconnect()
            run()
        })

        observer.observe(document, { childList: true, subtree: true })
    })()
""".trimIndent()

/**
 * `WebViewCompat.addDocumentStartJavaScript` from AndroidX WebKit, reimplemented with reflection
 * because R8 renames Discord's copy of AndroidX WebKit.
 *
 * WebView implements the AndroidX WebKit APIs behind `InvocationHandler`s, which find the method to call
 * from the name of the interface declaring the [java.lang.reflect.Method] they are given.
 */
private class DocumentStartScripts {
    private val loader = webViewClassLoader()

    private val factory = Class.forName("org.chromium.support_lib_glue.SupportLibReflectionUtil", false, loader)
        .getDeclaredMethod("createWebViewProviderFactory")
        .invoke(null) as InvocationHandler

    private val factoryInterface = boundaryInterface("WebViewProviderFactoryBoundaryInterface", loader)
    private val providerInterface = boundaryInterface("WebViewProviderBoundaryInterface", loader)

    val supported = (factory.invoke(null, factoryInterface.getMethod("getSupportedFeatures"), null) as Array<*>)
        .contains("DOCUMENT_START_SCRIPT:1")

    /**
     * Runs [script] at the start of every document whose origin matches one of [allowedOriginRules], in every frame.
     *
     * @return A handle to pass to [remove].
     */
    fun add(webView: WebView, script: String, allowedOriginRules: Array<String>): InvocationHandler {
        val provider = factory.invoke(
            null,
            factoryInterface.getMethod("createWebView", WebView::class.java),
            arrayOf(webView),
        ) as InvocationHandler

        return provider.invoke(
            null,
            providerInterface.getMethod("addDocumentStartJavaScript", String::class.java, Array<String>::class.java),
            arrayOf(script, allowedOriginRules),
        ) as InvocationHandler
    }

    companion object {
        fun remove(handle: InvocationHandler) {
            val scriptInterface = boundaryInterface("ScriptReferenceBoundaryInterface", webViewClassLoader())
            handle.invoke(null, scriptInterface.getMethod("remove"), null)
        }

        private fun boundaryInterface(name: String, loader: ClassLoader) =
            Class.forName("org.chromium.support_lib_boundary.$name", false, loader)

        private fun webViewClassLoader(): ClassLoader =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) WebView.getWebViewClassLoader()
            else Class.forName("android.webkit.WebViewFactory")
                .getDeclaredMethod("getProvider")
                .apply { isAccessible = true }
                .invoke(null)!!
                .javaClass.classLoader!!
    }
}
