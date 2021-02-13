import React, {useState} from 'react';
import {dbService} from 'fbase';

const Nweet = ({ nweetObj, isOwner }) =>{
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async() =>{
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok){
            //delete nweet;
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
        }
    }
    const toggleEditing = () => setEditing((prev)=> !prev);
    const onChange = (event) =>{
        const {target: {value}} = event;
        setNewNweet(value)
    }
    const onSubmit = async (event) =>{
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        });
        setEditing(false);
    }

    return(
        <>
        {editing ? (
            <>
            {isOwner && (
                <>
                    <form onSubmit={onSubmit}>
                        <input 
                            type="text" 
                            ploaceholder="Edit your nweet" 
                            value={newNweet} 
                            onChange={onChange} 
                            required 
                        />
                        <input type="submit" value="Update Nweet"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            )}
            </>
        ) : (
            <>
                <h4>{nweetObj.text}</h4>
                {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete Nweet</button>
                        <button onClick={toggleEditing}>Edit Nweet</button>
                    </>
                )}
                
            </>
        )}
        </>
        
    )
}

export default Nweet;