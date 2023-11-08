import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import data from './dat.json';

function Home() {

    const scrollView1 = useRef(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        scrollView1.current.style.height = (scrollView1.current.offsetHeight) + "px";
        setCourses(data.courses.map((course) => {return {id: course.id, name: course.name}}))
        //setCourses(data.courses.map((course) => {course.id, course.name}))
    },[])

    return (
    <div className="flex flex-row flex-1">
        <div className="flex flex-[2_2_0%]">
            <div className="flex flex-col flex-1 p-10">
                <span className="text-xl">Choose the course:</span>
                <div ref={scrollView1} className="h-full max-w-xl overflow-scroll p-3">
                    {courses.map((course) => (
                        <Link key={course.id} to={"course/"+course.id}>
                            <div className="border-2 rounded-2xl border-blue-800 bg-blue-100 p-5 m-3 text-xl">
                                {course.name} ({course.id})
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex-1 p-5 text-l border-l-2 border-black/40">
            Information about this site
        </div>
    </div>
    )
  }
  
  export default Home
  