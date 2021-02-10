import React, {useEffect, useState} from 'react';
import {dbService} from 'fbase';

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const getNeets = async() => {
        const dbs = await (dbService.collection("nweets").get());
        dbs.forEach(document => {
            const nweetObject = {
                ...document.data(),
                id: document.id,
            };
            setNweets(prev => [nweetObject, ...prev]);
        });
        
    }
    useEffect(() => {
        getNeets();
    },[])
    const onSumit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            nweet,
            createAt: Date.now(),
        });
        setNweet("");
    }
    const onChange = (event) => {
        const {target : {value}} = event;
        setNweet(value);
    }
    return(
        <div>
            <form onSubmit={onSumit}>
                <input type="text" value={nweet} onChange={onChange} placeholder="what's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map(nweet => (
                    <div key={nweet.id}>
                        <h4>{nweet.nweet}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;