import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  CssBaseline,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import axios from "axios";
import { Meal } from "./meal";
import DateFnsUtils from "@date-io/date-fns";
import { format, parse } from "date-fns";
import { ko } from "date-fns/esm/locale";
import { green } from "@material-ui/core/colors";

export const Schoolmeal = () => {
  return <Form />;
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    height: "100vh",
  },
  formControl: {
    marginTop: theme.spacing(1),
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    fontSize: 30,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    marginTop: 5,
    marginLeft: -43,
  },
}));

const Form = () => {
  const classes = useStyles();
  const today = new Date();
  const [loading, setLoading] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [once, setOnce] = React.useState(false);
  const [schools, setSchools] = React.useState([]);
  const [form, setForm] = useState({
    region: "",
    kraOrgNm: "",
    schulCode: "",
    schoolKind: "",
    schMmealScCode: "",
    schYmd:
      today.getFullYear() +
      "." +
      (today.getMonth() + 1) +
      "." +
      today.getDate(),
  });
  const [mealData, setMealData] = useState(null);

  const handleChange = (event) => {
    console.log(event);
    const name = event.target.name;
    setForm({
      ...form,
      [name]: event.target.value,
    });
  };

  const handleSchool = async (e) => {
    setForm({
      ...form,
    });
    const formdata = {
      query: e.target.value,
      region: form.region,
    };
    if (formdata.region !== "" && formdata.query !== "") {
      const schools = await getschools(formdata);
      setSchools(schools.schools);
    }
  };

  const handleDate = (e) => {
    setForm({
      ...form,
      schYmd: format(e, "yyyy.MM.dd"),
    });
  };

  const getmeal = async (form) => {
    try {
      const res = await axios.get("https://api.effx.one/meal", {
        params: form,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      return "error";
    }
  };

  const getschools = async (form) => {
    try {
      const res = await axios.get("https://api.effx.one/school", {
        params: form,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      return "error";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      region: form.region,
      schulCode: schools[0].orgCode,
      schulCrseScCode: schools[0].schulKndScCode,
      schulKndScCode: schools[0].schulCrseScCode,
      schMmealScCode: form.schMmealScCode,
      schYmd: form.schYmd,
    };
    setLoading(true);
    console.log(formData);
    const data = await getmeal(formData);
    console.log(data);
    try {
      if (data.status === "OK") {
        setMealData(data.meals);
        setLoading(false);
      } else {
        console.log(data.status);
        alert("?????? ???????????? ????????? ????????????!");
        setLoading(false);
      }
    } catch (e) {}
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <h1 className={classes.title}>{new Date().toLocaleDateString()}</h1>
          <FormControl className={classes.formControl}>
            <InputLabel>?????? ?????????</InputLabel>
            <Select
              labelId="schoolKind"
              id="schoolKind"
              value={form.region}
              onChange={handleChange}
              inputProps={{
                name: "region",
                id: "region",
              }}
            >
              <MenuItem value={"sen"}>???????????????</MenuItem>
              <MenuItem value={"pen"}>???????????????</MenuItem>
              <MenuItem value={"dge"}>???????????????</MenuItem>
              <MenuItem value={"ice"}>???????????????</MenuItem>
              <MenuItem value={"gen"}>???????????????</MenuItem>
              <MenuItem value={"dje"}>???????????????</MenuItem>
              <MenuItem value={"use"}>???????????????</MenuItem>
              <MenuItem value={"goe"}>?????????</MenuItem>
              <MenuItem value={"gwe"}>?????????</MenuItem>
              <MenuItem value={"cbe"}>????????????</MenuItem>
              <MenuItem value={"cne"}>????????????</MenuItem>
              <MenuItem value={"jbe"}>????????????</MenuItem>
              <MenuItem value={"jne"}>????????????</MenuItem>
              <MenuItem value={"kbe"}>????????????</MenuItem>
              <MenuItem value={"gne"}>????????????</MenuItem>
              <MenuItem value={"jje"}>?????????????????????</MenuItem>
            </Select>
          </FormControl>
          <br />
          {/* <Autocomplete
                    id = "?????? ??????"
                    options = {schools}
                    onChange={e => {
                        if(e.target.value !== "" | e.target.value != null) {
                            handleSchool(e.target.value);
                        }
                    }}
                    renderInput={(params) => <TextField disabled={form.region == ""} fluid name="search" label="?????? ??????" />}
                /> */}
          <TextField
            disabled={form.region === ""}
            onChange={handleSchool}
            fluid
            name="search"
            label="?????? ??????"
          />
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel>?????? ??????</InputLabel>
            <Select
              labelId="schMmealScCode"
              id="schMmealScCode"
              value={form.schMmealScCode}
              onChange={handleChange}
              inputProps={{
                name: "schMmealScCode",
                id: "schMmealScCode",
              }}
            >
              <MenuItem value={1}>??????</MenuItem>
              <MenuItem value={2}>??????</MenuItem>
              <MenuItem value={3}>??????</MenuItem>
            </Select>
          </FormControl>
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy.MM.dd"
              margin="normal"
              id="schYmd"
              label="?????? ??????"
              value={parse(form.schYmd, "yyyy.MM.dd", new Date())}
              onChange={handleDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <br />
          <Button type="sumbit" variant="contained" disabled={loading || disable}>
            ??????
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </form>
        {mealData && <Meal data={mealData} />}
      </Container>
    </div>
  );
};

export default Schoolmeal;
