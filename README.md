# 🔌 Revenge Next Plugins

This repository contains plugins for [Revenge Next](https://github.com/revenge-mod/revenge-bundle-next), an experimental modification for Discord Android.  
To "install" these plugins, you can drag the respective plugin directories into Revenge Next source's `plugins` directory and rebuild Revenge Next.

Make sure the plugin directory is placed into the correct stage. Check the plugin's source code for which stage it is intended for.

- With `preInit` lifecycle: [`src/plugins/preinit`](https://github.com/revenge-mod/revenge-bundle-next/tree/main/src/plugins/preinit)
- With `init` lifecycle: [`src/plugins/init`](https://github.com/revenge-mod/revenge-bundle-next/tree/main/src/plugins/init)
- With `start` lifecycle: [`src/plugins/start`](https://github.com/revenge-mod/revenge-bundle-next/tree/main/src/plugins/start)

## ❓ Why all of these steps?

Revenge Next is very experimental and does not support external plugins *just yet*.

## ⚠️ Disclaimer

These are unofficial plugins made by me (a maintainer of Revenge Next), but they are **not** endorsed by or affiliated the Revenge team.  
They may not work as expected and could potentially cause issues with your Revenge Next installation.

**Do not report issues related to these plugins to the Revenge team.**
