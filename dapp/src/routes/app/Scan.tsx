import QrScanner from "qr-scanner"
import {
  useEffect,
  useRef,
} from "react"
import { useNavigate } from "react-router-dom"

export default function Scan() {
  const navigate = useNavigate()
  const scanner = useRef<QrScanner | null>()
  const videoEl = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoEl.current) {
      console.log("start")
      scanner.current = new QrScanner(
        videoEl.current,
        onScanHandler,
        {
          highlightCodeOutline: true,
          highlightScanRegion: true,
        },
      )
      scanner.current.start()
    }

    return () => {
      if (!videoEl.current) return
      if (!scanner.current) return

      scanner.current.stop()
      scanner.current.destroy()
      scanner.current = null
    }
  }, [])

  async function onScanHandler(result: QrScanner.ScanResult) {
    const { data: id } = result

    navigate(`/app/contacts/${id}`)
  }

  return (
    <div className="w-full h-full">
      <video ref={videoEl} className="h-full object-cover"></video>
    </div>
  )
}
