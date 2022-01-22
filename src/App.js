import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Spinner, Button } from 'react-bootstrap';
import "./App.css";
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [file, setFile] = useState(null); // initial value is null
  // file, loading.. is var, setFile, setLoading... is function
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInput = React.createRef();

  const handleImageUpload = (e) => {
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


  useEffect(() => {
    if(loading){
      console.log(file)

      var body = {input_image: file}
        axios.post(" http://127.0.0.1:5000/predict", body).then(response => {
          setLoading(false)
          setResult(response.data)
        }).catch(error => {
          setLoading(false)
          setError("Invalid XML File")
        })
    }
  }, [loading])

  const handleReset = () => {
    setResult(null)
    setFile(null)
    setError(null)
  }


  return (
      <div style={{margin: '35px'}}>
        <h1 className="title">Pnueumonia Diagnosis App</h1>
        <p className="text"> Please upload a picture (in .png or .jpg type) to help us diagnose pnueumonia.</p>

        <div className="row">
          <div className="col-lg-6 mx-auto">
          {
            // put logic inside {}
                loading ? 
                // the ? is: if loading is true, render the following div tag, if false, render the tag after :
                <div style={{ position: 'relative', left: '48%', alignSelf: 'center', marginTop: '35px'}}>
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

                  
                  {/* todo: if the response type changes in backend, also need to change here */}
                  {
                    result && 
                    <div style= {{color:'white', fontStyle:'italic', position:'relative', left:'33%' }}>
                      Result Section:
                      <p>Rugby: {result.prediction.Rugby}
                      <br></br> Soccer: {result.prediction.Soccer}</p> 
                    </div> 
                  }

                  <div className="image-area mt-4">
                    {
                      file && 
                      <img className="img-fluid rounded shadow-sm mx-auto d-block" alt={result} src={file} />
                    }
                  </div>
                </>
            }

            <Button variant="dark" size="lg" onClick={() => setLoading(true)}> Diagnose! </Button>


          </div>
      </div>
    </div>
  );
}

export default App;

