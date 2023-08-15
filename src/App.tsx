import { Calender } from "./components";
import { EventsProvider } from "./context/Events";
import "./styles/index.css";

function App() {
  return (
    <EventsProvider>
      <Calender />
    </EventsProvider>
  );
}

export default App;
