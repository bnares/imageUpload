import React, {useState, useEffect} from 'react'
import Employee from './Employee'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPersonSwimming } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"

export default function EmployeeList() {
    const [employeeList, setEmployeeList] = useState([])
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [refreshFormAfterDeleting,setRefreshFormAfterDeleting] = useState(false);

    useEffect(()=>{
        refreshEmployeeList();
    },[])
   

    const employeeAPI = (url='https://localhost:7279/api/Employee')=>{
        return{
            fetchAll: ()=> axios.get(url),
            create: newRecord => axios.post(url, newRecord),
            update: (id,updatedRecord)=>axios.put(url+'/'+id, updatedRecord),
            delete: id=>axios.delete(url+"/"+id),
        }
    }

    function refreshEmployeeList(){
        //console.log("begining of refreshEmployeeList");
        employeeAPI().fetchAll()
            .then(resp=>{
                //console.log('resp'); 
                //console.log(resp);
                setEmployeeList(resp.data)
            })
            .catch(err=> console.error(err))
    }

    const addOrEdit = (formData, onSuccess)=>{
        if(formData.get('employeeId')=='0' || formData.get('employeeId')==0){
            //console.log("add or edit if");
            //formData.get('imageFile');
            employeeAPI().create(formData)
            .then(response=>{
                onSuccess();
                refreshEmployeeList();
            })
            .catch(err=>console.error(err));
        }else{
            //console.log("add or edit else");
            //console.log(formData.get('imageFile'));
            formData.append('imageFile', '');
            //console.log(formData.get('imageFile'));
            //debugger;
            employeeAPI().update(formData.get("employeeId"), formData)
                .then(resp=>{
                    onSuccess();
                    refreshEmployeeList();
                }).catch(err=>console.error(err));
        }
        
        
    }

    const showRecordDetails = (data)=>{
        //console.log("record for edit");
        //console.log(data);
        setRefreshFormAfterDeleting(true);
        setRecordForEdit(data);
    }
    
    const deleteElement = (data)=>{
        employeeAPI().delete(data.employeeId).then(resp=>{
            refreshEmployeeList();
        }).catch(err=>console.log(err))

        
    }

    const imageCard = data =>(
        <div className='card' onClick={()=>showRecordDetails(data)}>
            <img src={data.imageSrc} className ="card-img-top rounded-circle" />
            <div className='card-body'>
                <h5>{data.employeeName}</h5>
                <span>{data.occupation}</span>
                <br />
                <button className='btn btn-danger py-2 m-2' onClick={()=>deleteElement(data)}>Delete</button>
            </div>
        </div>
    )

    

  return (
    <>
    {/* {console.log("employeeList")}
    {console.log(employeeList)} */}
    <div className='row'>
        <div className='col-md-12'>
        <nav className="navbar bg-body-tertiary py-5 px-5 text-center" style={{backgroundColor:'rgba(34,37,39)'}}>
            <div className="container text-center">
                <FontAwesomeIcon icon={faPersonSwimming}  className='fa-10x'/>
            </div>
        </nav>

        </div>
        <div className='col-md-4'>
            <Employee 
                addOrEdit = {addOrEdit}
                recordForEdit = {recordForEdit}
                refreshFormAfterDeleting = {refreshFormAfterDeleting}
                setRefreshFormAfterDeleting = {setRefreshFormAfterDeleting}
            />
        </div>
        <div className='col-md-8'>
            <table>
                <tbody>
                    
                        {/* <tr>
                            <td>
                                {employeeList.length > 0 ? imageCard(employeeList[0]):  <div>EMpty</div>}
                            </td>
                        </tr> */}
                        {
                         [...Array(Math.ceil(employeeList.length/3))].map((e,i)=>
                         <tr key={i}>
                             <td>{imageCard(employeeList[3*i])}</td>
                             <td>{employeeList[3*i+1] ? imageCard(employeeList[3*i+1]) : null}</td>
                             <td>{employeeList[3*i+2] ? imageCard(employeeList[3*i+2]) : null}</td>
                         </tr>
                    )
                    }
                </tbody>
            </table>
        </div>
    </div>
    </>
  )
}
