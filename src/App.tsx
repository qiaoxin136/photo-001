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
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  ThemeProvider,
  Theme,
  Divider,
  Tabs,
  SelectField,
  ScrollView,
  //CheckboxField,
  // TextField,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

const theme: Theme = {
  name: "table-theme",
  tokens: {
    components: {
      table: {
        row: {
          hover: {
            backgroundColor: { value: "{colors.blue.20}" },
          },

          striped: {
            backgroundColor: { value: "{colors.orange.10}" },
          },
        },

        header: {
          color: { value: "{colors.blue.80}" },
          fontSize: { value: "{fontSizes.x3}" },
          borderColor: { value: "{colors.blue.20}" },
        },

        data: {
          fontWeight: { value: "{fontWeights.semibold}" },
        },
      },
    },
  },
};


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
  const [userName, setUserName] = useState<string>();
  const [description, setDescription] = useState<string>("");
  //const [lat, setLat] = useState(0);
  //const [lng, setLng] = useState(0);

  const [tab, setTab] = useState("1");

  //const [checked, setChecked] = useState<boolean>(false);

  const options: SelectOption[] = [
    { value: 'water', label: 'Water' },
    { value: 'wastewater', label: 'Wastewater' },
    { value: 'stormwater', label: 'Stormwater' },
    { value: 'pavement', label: 'Pavement' }
  ];

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
    //console.log((name));
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

  useEffect(() => {
    handleUserName();
     }, []);

  function createLocation() {
    handleUserName();
    //console.log(typeof userName);
    //console.log("Username:", userName);
    const name = userName
    console.log(name);
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
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab)}
        items={[
          {
            label: "History Map",
            value: "1",
            content: (<>
            
            </>)
          }, 
          {
            label: "History Data",
            value: "2",
            content: (<>
              <ScrollView
                  as="div"
                  ariaLabel="View example"
                  backgroundColor="var(--amplify-colors-white)"
                  borderRadius="6px"
                  //border="1px solid var(--amplify-colors-black)"
                  // boxShadow="3px 3px 5px 6px var(--amplify-colors-neutral-60)"
                  color="var(--amplify-colors-blue-60)"
                  // height="45rem"
                  // maxWidth="100%"
                  padding="1rem"
                // width="100%"
                // width="1000px"
                // height={"2400px"}
                // maxHeight={"2400px"}
                // maxWidth="1000px"

                >
                  <ThemeProvider theme={theme} colorMode="light">
                    <Table caption="" highlightOnHover={false} variation="striped"
                      style={{
                        //tableLayout: 'fixed',
                        width: '100%',
                        fontFamily: 'Arial, sans-serif',
                      }}>
                      <TableHead>
                        <TableRow>
                           <TableCell as="th" /* style={{ width: '15%' }} */>Date</TableCell>
                          <TableCell as="th" /* style={{ width: '15%' }} */>Time</TableCell>
                          <TableCell as="th" /* style={{ width: '10%' }} */>Track</TableCell>
                          <TableCell as="th" /* style={{ width: '15%' }} */>Type</TableCell>
                           <TableCell as="th" /* style={{ width: '15%' }} */>User</TableCell>
                           <TableCell as="th" /* style={{ width: '15%' }} */>Diameter</TableCell>
                          <TableCell as="th" /* style={{ width: '15%' }} */>Latitude</TableCell>
                          <TableCell as="th" /* style={{ width: '15%' }} */>Longitude</TableCell>
                        </TableRow>
                        <TableBody>
                          {location.map((location) => (
                            <TableRow
                              onClick={() => deleteLocation(location.id)}
                              key={location.id}
                            >
                             <TableCell /* width="15%" */>{location.date}</TableCell>
                              <TableCell /* width="15%" */>{location.time}</TableCell>
                              <TableCell /* width="10%" */>{location.track}</TableCell>
                              <TableCell /* width="15%" */>{location.type}</TableCell>
                              <TableCell /* width="15%" */>{location.username}</TableCell>
                              <TableCell /* width="15%" */>{location.diameter}</TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </TableHead>
                    </Table>
                  </ThemeProvider>
                </ScrollView>
            </>)
          },
        ]}
      />

    </main>
  );
}

export default App;
