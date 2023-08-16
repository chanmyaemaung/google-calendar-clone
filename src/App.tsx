import { useEffect } from "react";
import { Calender } from "./components";
import { EventsProvider } from "./context/Events";
import "./styles/index.css";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-W67JJJTSNL`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", "G-W67JJJTSNL");
    };
  }, []);

  return (
    <>
      <EventsProvider>
        <Calender />
      </EventsProvider>
    </>
  );
}

export default App;
