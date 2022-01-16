import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Spinner, Button } from 'react-bootstrap';
import "./App.css";
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [file, setFile] = useState(null) // initial value is null
  // file, loading.. is var, setFile, setLoading... is function
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const fileInput = React.createRef();

  console.log(file)
    
  const handleImageUpload = (e) => {
    console.log(e);
    handleReset();
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (e.target.files[0]) {
      if (e.target.files[0].name.match(/\.(png|PNG|JPG|jpg|})$/)){
        reader.onload = (e) => {
          setFile(e.target.result);
        };
        reader.readAsDataURL(file);
        return;
      } 
      setError("Invalid image");
    }
  };
  
  const deleteFile = () => {
      setFile(null);
  }

  // useEffect(() => {
  //   if(loading){
  //       const body = {
  //           svg: file.xmlCode
  //       }
  //       axios.post("https://2fozw1dnf4.execute-api.ap-southeast-2.amazonaws.com/Dev/svg_to_alt_text/generate",
  //           body).then(response => {
  //               setLoading(false)
  //               setResult(response.data)
  //       }).catch(error => {
  //           setLoading(false)
  //           setError("Invalid XML File")
  //       })
  //   }
  // }, [loading])

  const handleReset = () => {
    setResult(null)
    setFile(null)
    setError(null)
  }


  return (
      <div style={{margin: '35px'}}>
        <h1 className="title">Disease Diagnosis App</h1>
        <p className="text"> Please upload a picture to help us diagnose your disease.</p>

        <div className="row">
          <div className="col-lg-6 mx-auto">
          {
            // put logic inside {}
                loading ? 
                // the ? is: if loading is true, render the following div tag, if false, render the tag after :
                <div style={{ alignSelf: 'center', marginTop: '35px'}}>
                    <Spinner animation="border" />
                </div> : 
                <>
                  <div className="input-group mb-3 px-2 py-2 rounded-pill bg-white shadow-sm">
                      <input type="file" ref={fileInput} id="fileInput" onChange={handleImageUpload} className="form-control border-0"/>
                  </div>
                  {
                      error && 
                      // && is like if, if error is true, run the following
                      <ErrorMessage error={error}/> 
                  }

                  <p style={{ color: 'white', fontStyle: 'italic'}} className="text-center">The image uploaded as shown below.</p>

                  <div className="image-area mt-4">
                    {
                      file && 
                      <img className="img-fluid rounded shadow-sm mx-auto d-block" alt={result} src={file} />
                    }
                  </div>
                </>
            }

          </div>
      </div>
    </div>
  );
}

export default App;
