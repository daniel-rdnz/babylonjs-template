export default class PluginManager {
  constructor(url, callback) {
    const script = document.createElement('script')
    script.src = url
    document.head.appendChild(script)

    script.onload = () => {
        callback()
    }
  }
}
