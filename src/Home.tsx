import React ,{useState,useEffect}from 'react';
import axios from "axios";
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonRow,IonCol,IonGrid,IonModal,IonLabel,IonItem,IonInput,IonSelectOption,IonSelect} from '@ionic/react';

interface UserData {
  id: number;
  name: string;
  price: string;
}
interface users {
  id: number;
  name: string;
  price: number;
  oldprice:number;
  category:string;
  isActive:string;
  description:string;
 
}
const Home: React.FC = () => {
  const [data, setData] = useState<users[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldprice, setoldPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setisActive] = useState("");
  const [description, setDescription] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [popupData, setPopupData] = useState<UserData>({
    id: 0,
    name: '',
    price: '',
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
          name,
          price,
          oldprice,
          category,
          isActive,
          description,
        
        })
        .then((res) => {
          console.log(res.data);
           setId("")
          setName("");
          setPrice("");
          setoldPrice("");
          setCategory("");
          setisActive("");
          setDescription("");
         
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
        .put(`http://localhost:3000/users/${id}`, { id, name, price,oldprice,category,isActive,description })
        .then(() => {
          setId("");
          setName("");
          setPrice("");
          setoldPrice("");
          setCategory("");
          setisActive("");
          setDescription("");
         
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
    const handleUpdate = (id:string,name:string, price:string,oldprice:string,category:string,isActive:string,description:string) => {
      setId(id);
      setName(name);
      setPrice(price);
      setoldPrice(oldprice);
      setCategory(category);
      setisActive(isActive);
      setDescription(description);
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
          <IonCol style={{border:"1px solid"}}>name</IonCol>
          <IonCol style={{border:"1px solid"}}>Price</IonCol>
          <IonCol style={{border:"1px solid"}}>Oldprice</IonCol>
          <IonCol style={{border:"1px solid"}}>category</IonCol>
          <IonCol style={{border:"1px solid"}}>isActive</IonCol>
          <IonCol style={{border:"1px solid"}}>description</IonCol>
          <IonCol style={{border:"1px solid"}}>Delete</IonCol>
          <IonCol style={{border:"1px solid"}}>Update</IonCol>
         </IonRow>
     {data.map((item: any,i:any) => (
          <IonRow key={item.id} className='table'>
            <IonCol style={{border:"1px solid"}}>{item.id}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.name}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.price}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.oldprice}</IonCol>
            <IonCol style={{border:"1px solid"}}>{item.category}</IonCol>
            <IonCol style={{border:"1px solid"}}>
             {item.isActive === 'true' ? <p>true</p> : <p>False</p>}
            </IonCol>
            <IonCol style={{border:"1px solid"}}>{item.description}</IonCol>
            <IonCol style={{border:"1px solid"}}>
             <IonButton  onClick={() => {
                    handleDelete(item.id);
                  }}>Delete</IonButton></IonCol>
                  <IonCol style={{border:"1px solid"}}>
                  <IonButton  style={{color:"red"}} 
                  onClick={() =>
                    handleUpdate(item.id, item.name, item.price,item.oldprice,item.category,item.isActive,item.description)
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
              <IonLabel position="stacked">name</IonLabel>
              <IonInput
                value={popupData.name}
                onIonChange={(e) => setPopupData({ ...popupData, name: e.detail.value! })}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Price</IonLabel>
              <IonInput
                value={popupData.price}
                onIonChange={(e) => setPopupData({ ...popupData, price: e.detail.value! })}
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
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="oldprice"
        value={oldprice}
        onChange={(e) => setoldPrice(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
       <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="isActive"
        value={isActive}
        onChange={(e) => setisActive(e.target.value)}
      />
      <input style={{padding:"10px",marginLeft:"70px",marginTop:"30px"}}
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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



