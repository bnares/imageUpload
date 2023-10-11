import React,{useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'


const initialValues = {
    employeeId:0,
    employeeName:'',
    occupation:'',
    imageName:'',
    imageSrc:'',
    imageFile:null
}

export default function Employee({addOrEdit,recordForEdit,refreshFormAfterDeleting,setRefreshFormAfterDeleting}) {
    //const {addOrEdit} = props;
    const [values, setValues] = useState(initialValues);
    const [errors,setErrors] = useState({});
    const [compareValuesForm, setCompareValuesForm] = useState(recordForEdit);

    useEffect(()=>{
        
        if(recordForEdit != null){
            console.log("recordForEdit!!!!!!!");
            console.log(recordForEdit);
            setValues(recordForEdit);
            //setRecordForEdit(null);
            console.log("updated values!!!!!!!!!!");
            console.log(values);
            //setCompareValuesForm(recordForEdit);
        }
        
    },[recordForEdit])

    useEffect(()=>{
        if(refreshFormAfterDeleting) resetForm();
        setRefreshFormAfterDeleting(false);
    }, [refreshFormAfterDeleting])

    const handleInputChange = (e)=>{
        console.log("handle input change");
        console.log(e.target);
        
        const {name,value} = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const showPreview = (e)=>{
        //console.log("e");
        //console.log(e);
        console.log("beggining of show preview e");
        console.log(e);
        if(e.target.files && e.target.files[0]){
            console.log("inside showPreview in if");
            let imageFile = e.target.files[0];
            //let imageFile = URL.createObjectURL(e.target.files[0])
            console.log("imageFile");
            console.log(imageFile);
            const reader = new FileReader();
            reader.onload = x=>{
                //console.log("x");
                //console.log(x);
                
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result,
                })
            }
            reader.readAsDataURL(imageFile); //here we triggered reader.onload event function if not this line the event will not run
            console.log(values);
        }else{
            console.log("showPreview else");
            setValues({
                ...values,
                imageName:null,
                imageSrc: '',
            })
        }
    }

    const applyErrorClass = field=>(
        ((field in errors && errors[field]==false)?' invalid-field':'')
                                                    
    )

    const validate = ()=>{
        let temp = {};
        //console.log('validation');
        temp.employeeName = values.employeeName ==""?false:true;
        temp.occupation = values.occupation==""?false:true;
        temp.imageSrc = values.imageSrc =='' ? false:true;
        setErrors(temp);
        console.log(Object.values(temp).every(x=>x==true));
        return Object.values(temp).every(x=>x==true);
    }

    const resetForm = ()=>{
        setValues(initialValues);
        document.getElementById('image-uploader').value = null; //we cant reset image field juz by setValues we need to do this manually
        setErrors({});
    }

    const handleSubmit = e =>{
        e.preventDefault();

        if(validate()){
            console.log("values in validate");
            console.log(values);
            const formData = new FormData();
            formData.append('employeeId', values.employeeId);
            formData.append('employeeName', values.employeeName);
            formData.append('occupation', values.occupation);
            formData.append('imageName', values.imageName);
            formData.append('imageFile', values.imageFile);
            formData.append('imageSrc', values.imageSrc);
            addOrEdit(formData,resetForm);
           
        }

    }

  return (
    <>
        {console.log("values")}
        {console.log(values)}
        <div className='container text-center'>
            <p className='lead'>An Employee</p> 
        </div>
        
        <form noValidate onSubmit={handleSubmit}>
            <div className='card'>
                {values.imageSrc != '' ? <img src={values.imageSrc} className = 'card-img-top' /> : <FontAwesomeIcon icon={faUserSecret} className='fa-10x py-2' />}
                
                <div className='card-body p-5'>
                    <div className='form-group py-3'>
                        <input type='file' name='imageSrc' accept='image/*' className={'form-control'+applyErrorClass('imageSrc')}
                            onChange={showPreview} id="image-uploader"
                        />
                    </div>
                    <div className='form-group'>
                        <input className={'form-control'+applyErrorClass('employeeName')} 
                            placeholder='Employee Name'
                            name='employeeName'
                            value={values.employeeName}
                            onChange = {handleInputChange}
                         />
                         
                    </div>
                    <div className='form-group py-3'>
                        <input className={'form-control'+applyErrorClass('occupation')} 
                            placeholder='Occupation'
                            name='occupation'
                            value={values.occupation}
                            onChange = {handleInputChange}
                         />
                    </div>
                    <div className='form-group text-center'>
                        <button type='submit' className='btn btn-light'>Submit</button>
                    </div>
                </div>
            </div>
        </form>
        

        
    </>
    
  )
}
