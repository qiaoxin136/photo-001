import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { checkLoginAndGetName } from "./utils/AuthUtils";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import "@aws-amplify/ui-react/styles.css";

import {
  //Input,
  Flex,
  Button,
  //Table,
  //TableBody,
  //TableHead,
  //TableCell,
  //TableRow,
  //ThemeProvider,
  //Theme,
  Divider,
  //ScrollView,
  //Tabs,
  SelectField,
  //CheckboxField,
  // TextField,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";




type SelectOption = {
  value: string;
  label: string;
};

function App() {

  const { signOut } = useAuthenticator();
  const client = generateClient<Schema>();
  const [location, setLocation] = useState<Array<Schema["Location"]["type"]>>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  //const [report, setReport] = useState("");
  const [track, setTrack] = useState<number>();
  const [type, setType] = useState<string>("water");
  const [diameter, setDiameter] = useState<number>();
  const [userName, setUserName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  //const [lat, setLat] = useState(0);
  //const [lng, setLng] = useState(0);

  //const [tab, setTab] = useState("1");

  //const [checked, setChecked] = useState<boolean>(false);

  const options: SelectOption[] = [
    { value: 'water', label: 'Water' },
    { value: 'wastewater', label: 'Wastewater' },
    { value: 'stormwater', label: 'Stormwater' },
    { value: 'pavement', label: 'Pavement' }
  ];



  //  const options3: SelectOption[] = [
  //   { value: '6', label: '6' },
  //   { value: '8', label: '8' },
  //   { value: '10', label: '10' },
  //   { value: '12', label: '12' },
  //   { value: '15', label: '15' },
  //   { value: '18', label: '18' },
  //   { value: '24', label: '24' },
  //   { value: '30', label: '30' },
  //   { value: '36', label: '36' },
  //   { value: '42', label: '42' },
  // ]; 


  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleTrack = (e: ChangeEvent<HTMLInputElement>) => {
    setTrack(parseInt(e.target.value));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    //console.log(value);
    setType(value);
  }

  const handleDiameter = (e: ChangeEvent<HTMLInputElement>) => {
    setDiameter(parseInt(e.target.value));
  }

  const handleUserName = async () => {
    const name = await checkLoginAndGetName();
    console.log((name));
    if (name) {
      setUserName(name)
    }
  }

  const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }

  useEffect(() => {
    client.models.Location.observeQuery().subscribe({
      next: (data) => setLocation([...data.items]),
    });
  }, []);

  function createLocation() {
    handleUserName();
    //console.log(typeof userName);
    //console.log("Username:", userName);
    const name=userName || "Anonymous";
    client.models.Location.create({
      date: date,
      time: time,
      track: track,
      type: type,
      diameter: diameter,
      username: name,
      description: description,

      // lat: lat,
      // lng: lng,

    });
    setDate("");
    setTime("");
    setTrack(track);
    setType(type);
    setDiameter(diameter);
    setUserName("");
    setDescription("");
    //setLat(0);
    //setLng(0);
  }

  function deleteLocation(id: string) {
    client.models.Location.delete({ id })
  }


  return (
    <main>
      <h1>Lift Station A-19 Force Main Replacement Project</h1>
      <Divider orientation="horizontal" />
      <br />
      <Flex>
        <Button onClick={signOut} width={120}>
          Sign out
        </Button>
        <Button onClick={createLocation} backgroundColor={"azure"} color={"red"}>
          + new
        </Button>
      </Flex>
      <br />
      <Flex direction="row">

        <input
          type="date"
          value={date}
          placeholder="date"
          onChange={handleDate}
        //width="150%"
        />
        <input
          type="time"
          value={time}
          placeholder="time"
          onChange={handleTime}
        //width="150%"
        />
        <input
          type="number"
          value={track}
          placeholder="track"
          onChange={handleTrack}
        //width="150%"
        />
        <SelectField
          label="Select an option"
          labelHidden={true}
          value={type}
          onChange={handleSelectChange}
        //width="100%"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>


        <input
          type="number"
          value={diameter}
          placeholder="diameter"
          onChange={handleDiameter}
        //width="150%"
        />

        {/*         <input
          type="text"
          value={userName}
          placeholder="username"
          onChange={handleUserName}
          //width="150%"
        /> */}
        <input
          type="text"
          value={description}
          placeholder="description"
          onChange={handleDescription}
        //width="150%"
        />
        {/*         <Input type="number" value={lat} />
        <Input type="number" value={lng} /> */}
      </Flex>
      <Divider orientation="horizontal" />
      <br />
      <ul>
        {location.map(location => <li
          onClick={() => deleteLocation(location.id)}
          key={location.id}>
          {location.date}
        </li>)}
      </ul>


    </main>
  );
}

export default App;
