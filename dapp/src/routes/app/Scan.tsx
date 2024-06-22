import QrScanner from "qr-scanner"
import {
  useEffect,
  useRef,
} from "react"
import { useNavigate } from "react-router-dom"

export type QrCodePayload = {
  id: string
  amount: number
}

export default function Scan() {
  const navigate = useNavigate()
  const scanner = useRef<QrScanner>()
  const videoEl = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoEl.current) {
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
      if (videoEl.current) {
        scanner.current?.stop()
      }
    }
  }, [])

  async function onScanHandler(result: QrScanner.ScanResult) {
    const { data } = result
    const value: QrCodePayload = JSON.parse(data)
    navigate("/app", { state: value })
  }

  return (
    <div className="w-full h-full">
      <video ref={videoEl} className="h-full object-cover"></video>
    </div>
  )
}
