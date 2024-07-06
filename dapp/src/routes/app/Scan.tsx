import QrScanner from "qr-scanner"
import {
  useEffect,
  useRef,
} from "react"
import { useNavigate } from "react-router-dom"

export default function Scan() {
  const navigate = useNavigate()
  const qrScanner = useRef<QrScanner | null>()
  const videoEl = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoEl.current) return

    qrScanner.current = new QrScanner(
      videoEl.current,
      onScanHandler,
      {
        highlightCodeOutline: true,
        highlightScanRegion: true,
      },
    )

    qrScanner.current.start()

    return () => {
      if (!qrScanner.current) return

      qrScanner.current.pause()
      qrScanner.current.stop()
      qrScanner.current.destroy()
      // qrScanner.current = null
    }
  }, [])

  async function onScanHandler(result: QrScanner.ScanResult) {
    const { data } = result
    const url = new URL(data)
    const id = url.pathname.split("/")[3]
    navigate(`/app/contacts/${id}`)
  }

  return (
    <div className="w-full h-full">
      <video ref={videoEl} className="h-full object-cover"></video>
    </div>
  )
}
