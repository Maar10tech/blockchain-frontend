import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'
import data from './dat.json';
import { HiOutlineBackspace } from 'react-icons/hi';

const exampleStudent = {
    ID: "",
    Name: "",
    Surname: "",
    Group: "",
    Grade1: null,
    Grade2: null,
    Grade3: null,
    Grade4: null,
}

function CourseDetails() {

    const scrollView1 = useRef(null);
    const [students, setStudents] = useState([]);
    const [rerender, setRerender] = useState(0)
    const {courseId} = useParams();

    const [student, setStudent] = useState(exampleStudent);

    useEffect(() => {
        scrollView1.current.style.height = (scrollView1.current.offsetHeight) + "px";
      
        setStudents(data.courses.find((course) => course.id==courseId).students)
    },[courseId])

    const askForStudentCreation = (student) => {

      Swal.fire({
        title: '',
        text: "No course data for this student in the blockchain. Do you want to create the asset?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Create asset',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return axios.post('http://localhost:3000/assets/create', 
            {
              ID: courseId+student.id, 
              Name: student.name,
              Surname: student.surname
            })
          .then(function (response) {
            return response
          })
          .catch(function (error) {
            console.log(error);
            Swal.showValidationMessage(
                `Request failed: ${error}`
              )
          })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result)
          getStudent(student)
          Swal.fire({
            title: `Created successfully`
          })
        }
      })
    }

    const getStudent = async (student) => {
        try {
            const response = await axios.get('http://localhost:3000/assets/'+courseId+student.id);
            console.log(response);
            const newStudent = response.data
            setStudent(newStudent)
            setRerender(rerender+1)
        } catch (error) {
            console.error(error);
            if(error?.response?.data?.cause?.details.includes("does not exist"))
              askForStudentCreation(student)
            else
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.cause?.details??error.message,
                showConfirmButton: false,
                timer: 2500
              })
            setStudent(exampleStudent)
        }
    }

    const changeGrade = async (testNo) => {
        const { value: grade } = await Swal.fire({
            input: 'number',
            inputLabel: 'Grade',
            inputPlaceholder: 'Enter the grade',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                  return 'You need to write a number'
                }
              }
          })
        if (grade) {
            student["Grade"+testNo]=grade;
            setRerender(rerender+1)
            Swal.close();
        }
    }
    const saveChanges = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Save to blockchain',
            reverseButtons: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return axios.post('http://localhost:3000/assets/update', student)
              .then(function (response) {
                return response
              })
              .catch(function (error) {
                console.log(error);
                Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
              })
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              console.log(result)
              Swal.fire({
                title: `Saved successfully`
              })
            }
          })
    }
  
    return (
      <div className="flex flex-row flex-1">
        <div className="flex-1">
            <div className="h-1/6 text-xl flex flex-row justify-center items-center border-b-2 border-black/10">
              <Link to="/" className="p-3 text-red-800 text-2xl">
                <HiOutlineBackspace />
              </Link>
              <div className="flex-1 border-l-2 border-black/5 p-3">
                Students of course {data.courses.find((course) => course.id==courseId).name} ({courseId})
              </div>
            </div>
            <div ref={scrollView1} className="h-5/6 max-w-xl overflow-scroll">
                {students.map((student) => (
                    <div key={student.id} className="flex">
                    <button className="border-2 flex-1 rounded-2xl border-blue-800 bg-blue-100 p-2 m-3 text-l"
                        onClick={() => {console.log("click "+student.id); getStudent(student)}}>
                        {student.name} {student.surname} ({student.id})
                    </button>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex-1 flex-col border-l-2 border-r-2 border-black/40 p-3">
            <div className="m-3">ID: {student.ID} </div>
            <div className="m-3">Course ID: {student.ID.substring(0,5)} </div>
            <div className="m-3">Student ID: {student.ID.substring(5)} </div>
            <div className="m-3">Name: {student.Name} </div>
            <div className="m-3 mb-10">Surname: {student.Surname} </div>
            
            {student.ID && student.Name && student.Surname ?<>
                <div className="m-3 flex justify-around"><p>Grade 1:</p><p>{student.Grade1?student.Grade1:"n.A."}</p><button onClick={() => {changeGrade(1)}} className="px-4 border-2 rounded-xl border-yellow-700">edit</button></div>
                <div className="m-3 flex justify-around"><p>Grade 2:</p><p>{student.Grade2?student.Grade2:"n.A."}</p><button onClick={() => {changeGrade(2)}} className="px-4 border-2 rounded-xl border-yellow-700">edit</button></div>
                <div className="m-3 flex justify-around"><p>Grade 3:</p><p>{student.Grade3?student.Grade3:"n.A."}</p><button onClick={() => {changeGrade(3)}} className="px-4 border-2 rounded-xl border-yellow-700">edit</button></div>
                <div className="m-3 flex justify-around"><p>Grade 4:</p><p>{student.Grade4?student.Grade4:"n.A."}</p><button onClick={() => {changeGrade(4)}} className="px-4 border-2 rounded-xl border-yellow-700">edit</button></div>
                
                <div className="m-10 flex justify-around">
                    <button onClick={() => {getStudent({id: student.ID.substring(5), name: student.Name, surname: student.Surname})}} className="p-3 border-2 rounded-xl border-red-600/80">Undo changes</button>
                    <button onClick={() => {saveChanges()}} className="p-3 border-2 rounded-xl border-green-600">Save changes</button>
                </div>
            </>:<></>}

        </div>
        <div className="flex-1 p-5 text-l">
            Information about this site
        </div>
      </div>
    )
  }
  
  export default CourseDetails
  
