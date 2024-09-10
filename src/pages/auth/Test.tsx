import React, { useState, useEffect } from 'react';

const C = () => {

    console.log('C component render');
    useEffect(() => {
        console.log('C component useEffect');
    },[]);
    useEffect(() => {
    console.log('C component useEffect2');
     },[])

    return <div>Component C</div>;
};

///////////////////////////////////////////////////////////////////////////////////////

const B = () => {

    const [count, setCount] = useState(0);
    console.log('B component render');
    useEffect(() => {
        console.log('B component useEffect');
    }, [count]);
//console 먼저 하고 return 안에 있는거 하고 useEffect한다.

    return (
        <div>
            Component B
            <button onClick={() => setCount(count + 1)}>Increment B</button>
            <C />
        </div>
    );
};

////////////////////////////////////////////////////////////////////////////

const Test = () => {

    console.log('A component render');
    useEffect(() => {
        console.log('A component useEffect');
    });

    return (
        <div>
            Component A
            <B />
        </div>
    );
};



export default Test;