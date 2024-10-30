import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from 'axios';

const PlacesPage = () => {
  

  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");

  const [addphoto, setAddphoto] = useState([]);
 
  const [description, setDescription] = useState("");
  const [photolink, setPhotolink] = useState("");
  const [perks, setPerks] = useState([]);
  const [extrainfo, setExtrainfo] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [maxguest, setMaxguest] = useState(1);


  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }
  

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
 
  
  async function addPhotoByLink(ev) {
    ev.preventDefault(); 
    // console.log("hjv ")
    const {data:filename}= await axios.post("api/house_owner/upload-by-link",{link:photolink});
    setAddphoto(prev=>{
      console.log(filename);

      
      return[...prev, filename]
    });
   


  }
   
  

  const  uploadPhoto=useCallback((ev)=> {
    const files = ev.target.files;
    if (!files || files.length === 0) return; 

    const data = new FormData();
    // console.log(data.type);
    
    // console.log(files.length);
    
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    axios.post('/api/house_owner/uploads', data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(response => {
      const { data: filenames } = response;
      setAddphoto([...filenames]);
    })
    .catch(error => {
      console.error("Error uploading photos:", error);
    });
  },[])

  
  return (
    <div>
      {action !== "new" && (

        <div className="text-center">
          <Link
            to={"new/"}
            className="inline-flex gap-1 bg-primary text-white py-2 px-4 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new Places
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form>
            {preInput("Title", "Enter a good title")}
            <input
              className="text-xl mt-4"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              type="text"
              placeholder="Title: My Apartment"
            />
            {preInput("Address", "i.e. Patna")}
            <input
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              className="text-xl mt-4"
              type="text"
              placeholder="Address or place"
            />
            {preInput("Photo", "More = Better")}
            <div className="flex gap-2">
              <input
                value={photolink}
                onChange={(ev) => setPhotolink(ev.target.value)}
                type="text"
                placeholder="Add using link ...jpg"
              />
              <button className="bg-gray-200 p-2 rounded-xl" onClick={addPhotoByLink}>
                Add&nbsp;Photo
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {addphoto.length > 0 && addphoto.map((link, index) => (
                <div key={index} className="relative">
                  <img 
                    src={`http://localhost:5000/api/${link}`} 
                    alt={`Uploaded ${index + 1}`} 
                    className="w-full h-full object-cover p-2 rounded-2xl" 
                    onError={(e) => e.currentTarget.src = 'path/to/placeholder/image.jpg'} 
                  />
                </div>

              ))}
              <label className="cursor-pointer flex justify-center gap-1 border bg-transparent rounded-2xl p-8 text-xl text-gray-600">
                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                Upload
              </label>
            </div>
            {preInput("Description", "Description about your place")}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder="Description about your place"
            />
            {preInput("Perks", "Select all the perks of your place")}
            <Perks selected={perks} onChange={setPerks} />
            {preInput("Extra Info", "House-rules, etc.")}
            <textarea
              value={extrainfo}
              onChange={(ev) => setExtrainfo(ev.target.value)}
            />
            {preInput("Check-in & Check-out", "Add check-in & check-out times")}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-2">Check-in Time</h3>
                <input
                  value={checkin}
                  onChange={(ev) => setCheckin(ev.target.value)}
                  type="text"
                  placeholder="16:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-2">Check-out Time</h3>
                <input
                  value={checkout}
                  onChange={(ev) => setCheckout(ev.target.value)}
                  type="text"
                  placeholder="12:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-2">Max number of guests</h3>
                <input
                  value={maxguest}
                  onChange={(ev) => setMaxguest(ev.target.value)}
                  type="number"
                  placeholder="2-3"
                />
              </div>
              <div>
                <button className="bg-primary text-white py-2 px-4 rounded-full m-2">Save</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;
