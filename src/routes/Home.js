import React, {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {dbService, storageService} from 'fbase';
import Nweet from 'components/Nweet';

const Home = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState(null);
    useEffect(() => {
        dbService.collection("nweets")
          .onSnapshot((snapshot) => {
            const nweetsArray = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setNweets(nweetsArray);
          });
      }, []);

    const onSumit = async (event) => {
        event.preventDefault();
        let attachmentUrl ="";

        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createAt: Date.now(),
            creatorId : userObj.uid,
            attachmentUrl 
        };
        await dbService.collection('nweets').add(nweetObj);
        setNweet("");
        setAttachment("");
    }
    const onChange = (event) => {
        const {target : {value}} = event;
        setNweet(value);
    }
    const onFileChange = (event) =>{
        const {target: {files}} = event;
        const theFile = files[0]
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);

        }
        reader.readAsDataURL(theFile);
    }
    const onClearPhotoClick = () =>{
        setAttachment(null)
    }
    return(
        <div>
            <form onSubmit={onSumit}>
                <input type="text" value={nweet} onChange={onChange} placeholder="what's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet" />
                {attachment && <div><img src={attachment} width="50px" height="50px" alt={nweet} title={nweet} />
                <button onClick={onClearPhotoClick}>clear</button>
                </div>}
            </form>
            <div>
                {nweets.map(nweet => (
                    <Nweet 
                        key={nweet.id} 
                        nweetObj={nweet} 
                        isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}

export default Home;