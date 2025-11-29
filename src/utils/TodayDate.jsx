import { useEffect, useState } from "react"
import { getDateTime} from "./getDateTime"

const Date = ({ className }) => {
  const [now, setNow] = useState(getDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(getDateTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return <div className={className}>{now.full}</div>;
}
export default Date;