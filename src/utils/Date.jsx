import { useEffect, useState } from "react"
import { getDateTime} from "./getDateTime"

const Clock = () => {
  const [now, setNow] = useState(getDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getDateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <div>{now.full}</div>;
}
export default Clock;