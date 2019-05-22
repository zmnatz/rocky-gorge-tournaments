import React from 'react';
import fire from "./api/fire";

export default (location) => {
  const firebaseRef = React.useMemo(
    () => fire.database().ref(location).orderByKey(),
    [location]
  )
  const [data, setData] = React.useState([])

  firebaseRef.on("child_added", snapshot => {
    setData(prev => ({
      ...prev,
      [snapshot.key]: {
        ...prev[snapshot],
        ...snapshot.val(),
        id: snapshot.key
      }
    }))
  });

  teamsRef.on("child_removed", snapshot =>
    setData(prev => ({
      ...prev,
      [snapshot.key]: undefined
    }))
  );

  return data;
}