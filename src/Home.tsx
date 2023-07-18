import React ,{useState,useEffect}from 'react';
import axios from "axios";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonRow,IonCol,IonGrid,IonModal,IonLabel,IonItem,IonInput} from '@ionic/react';
interface UserData {
  id: number;
  username: string;
  password: string;
  
}
interface users {
  id: number;
  username: string;
  password: number;
  phonenumber:number;
  gender:string;
}
const Home: React.FC = () => {
  const [data, setData] = useState<users[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [gender, setGender] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popupData, setPopupData] = useState<UserData>({
    id: 0,
    username: '',
    password: '',
    
  });
    const fetchData=()=>{
         axios.get("http://localhost:3000/users")
         .then((res)=>{
          console.log(res.data);
          setData(res.data);
         })
         .catch((err)=>{
          console.log(err);
       })
    }
    useEffect(()=>{
      fetchData()
    },[])
  const handleDelete=((id:number)=>{
      axios.delete(`http://localhost:3000/users/${id}`)
      setData(data.filter((item)=>{
       return item.id !==id
      }))
    })
   const handleClick = (e:any) => {
      e.preventDefault();
      axios
        .post("http://localhost:3000/users", {
          id,
          username,
          password,
          phonenumber,
          gender
        })
        .then((res) => {
          console.log(res.data);
           setId("")
          setUsername("");
          setPassword("");
          setPhonenumber("");
          setGender("");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          fetchData();
        });
    };
    const handleEdit = () => {
      axios
        .put(`http://localhost:3000/users/${id}`, { id, username, password,phonenumber,gender })
        .then(() => {
          setId("");
          setUsername("");
          setPassword("");
          setPhonenumber("");
          setGender("");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          fetchData();
          setEdit(false);
        });
    };
    const handlePopupUpdate = () => {
    axios
      .put(`http://localhost:3000/users/${popupData.id}`, popupData)
      .then(() => {
        setShowPopup(false);
        setEditMode(false);
        fetchData();
      })
      .catch((err) => console.log(err));
  };
    const handleUpdate = (id:string,username:string, password:string,phonenumber:string,gender:string) => {
      setId(id);
      setUsername(username);
      setPassword(password);
      setPhonenumber(phonenumber);
      setGender(gender);
      setEdit(true);
     
    };
    const handleEdits = (userData: UserData) => {
      setShowPopup(true);
      setEditMode(true);
      setPopupData(userData);
    };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>API Table Example</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

     <IonGrid className="table">
       
       
    <IonRow style={{border:"1px solid"}}>
          <IonCol style={{border:"1px solid"}}>Id</IonCol>
          <IonCol style={{border:"1px solid"}}>Username</IonCol>
          <IonCol style={{border:"1px solid"}}>Password</IonCol>
          <IonCol style={{border:"1px solid"}}>Phonenumber</IonCol>
          <IonCol style={{border:"1px solid"}}>Gender</IonCol>
          <IonCol style={{border:"1px solid"}}>Delete</IonCol>
          <IonCol style={{border:"1px solid"}}>Update</IonCol>
         
          
        </IonRow>
     {data.map((item: any) => (
          <IonRow key={item.id} className='table'>
            <IonCol style={{border:"1px solid"}}>{item.id}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.username}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.password}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.phonenumber}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.gender}</IonCol>
            <IonCol style={{border:"1px solid"}}>
             <IonButton  onClick={() => {
                    handleDelete(item.id);
                  }}>Delete</IonButton></IonCol>
                  <IonCol style={{border:"1px solid"}}>
                  <IonButton  style={{color:"red"}} 
                  onClick={() =>
                    handleUpdate(item.id, item.username, item.password,item.phonenumber,item.gender)
                  }
                >
                  Update
                </IonButton> 
                <IonCol>
                <IonButton onClick={() => handleEdits(item)}>Edit</IonButton>
              </IonCol>  
                </IonCol>
          </IonRow>
        ))}
      
      </IonGrid>
      <IonModal isOpen={showPopup} onDidDismiss={() => setShowPopup(false)}>
          <IonContent className="ion-padding">
            <h2>{editMode ? 'Edit User Data' : 'Add User Data'}</h2>
            <IonItem>
              <IonLabel position="stacked">ID</IonLabel>
              <IonInput
                type="number"
                value={popupData.id}
                onIonChange={(e) => setPopupData({ ...popupData, id: +e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Username</IonLabel>
              <IonInput
                value={popupData.username}
                onIonChange={(e) => setPopupData({ ...popupData, username: e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                value={popupData.password}
                onIonChange={(e) => setPopupData({ ...popupData, password: e.detail.value! })}
              />
            </IonItem>
            <IonButton onClick={handlePopupUpdate}>
              {editMode ? 'Update' : 'Add'}
            </IonButton>
            <IonButton onClick={() => setShowPopup(false)}>Cancel</IonButton>
          </IonContent>
        </IonModal>
     
    <input style={{padding:"10px",marginLeft:"50px"}}
        type="text"
        placeholder="Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"50px"}}
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="Phonenumber"
        value={phonenumber}
        onChange={(e) => setPhonenumber(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
        {edit ? (
        <IonButton onClick={handleEdit}>update</IonButton>
      ) : (
        <IonButton type="submit" onClick={handleClick} style={{marginLeft:"70px"}}> 
          Add
        </IonButton>
      )}
     
     </IonContent>
   
     </IonPage>
     );
};

export default Home;





















