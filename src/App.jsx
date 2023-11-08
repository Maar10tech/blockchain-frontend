import Header from "./Header"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CourseDetails from "./CourseDetails";

function App() {

  return (
    <BrowserRouter>
      <div className='w-screen h-screen flex flex-1 flex-col'>
        <Header />
        <div className="flex flex-1 bg-gray-300">
          
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="course/:courseId" element={<CourseDetails />} />
            </Routes>
          
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
