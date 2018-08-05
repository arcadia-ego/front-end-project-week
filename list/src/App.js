import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import mongoose from "mongoose";
import { Route, NavLink, Redirect } from "react-router-dom";
import {
  SideBar,
  AddNoteView,
  ViewNote,
  EditNote,
  LoginChecker
} from "./components";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import NoteContainer from "./components/noteContainer";

import "./App.css";

class App extends Component {
  state = {
    user: {},
    notes: [],

    newNote: { title: "", body: "" }
  };

  componentDidMount() {
    this.setState();
  }

  handleChange = event => {
    console.log(this.state);
    const { name, value } = event.target;
    const { newNote, notes } = this.state;
    this.setState({ newNote: { ...newNote, [name]: value, id: notes.length } });
  };

  addNote = async event => {
    try {
      const { notes, newNote } = this.state;
      const userRef = localStorage.getItem("user._id");
      const response = await axios.post("http://localhost:5000/notes", {
        ...newNote,
        userRef
      });
      if (response.status === 200) {
        this.setState({
          newNote: { body: "", title: ""},
          notes: [...notes, newNote]
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  editNote = id => {
    const { notes, newNote } = this.state;
    console.log("ID EDIT NOTE", id);
    console.log(this.state);
    const newArr = notes.map(note => (note.id === id ? newNote : note));
    console.log("NEW ARR EDIT", newArr)
    console.log("NEWNOTE BEFORE AXIOS", newNote);
    axios.put(`http://localhost:5000/notes/${id}`, newNote);
    this.setState({ notes: newArr });
  };

  renderNoteView = props => {
    return (
      <AddNoteView
        handleChange={this.handleChange}
        addNote={this.addNote}
        note={this.state.newNote}
        {...props}
      />
    );
  };

  indivNoteView = props => {
    console.log(window.location.href)
    // const url = window.location.href.endsWith()
    // console.log("URL", url);
    let filteredNote;
    this.state.notes.map(note => {
      console.log("NOTE IN APP MAP", note);
      if (window.location.href.endsWith(note._id)) {
        return filteredNote = note
      }
      console.log("FILTERED NOTE", filteredNote);
    })
    return <ViewNote notes={filteredNote} deleteNote={this.deleteNote} />;
  };

  editNoteView = props => {
    console.log("PROPS EDIT NOTE VIEW", props);
    const filteredNotes = this.state.notes.filter(
      note => +props.match.params.id !== note.id
    );
    console.log("FILTERED NOTES EDIT VIEW", filteredNotes);
    return (
      <EditNote
        note={filteredNotes[0]}
        handleChange={this.handleChange}
        editNote={this.editNote}
        {...props}
        {...this.state}
      />
    );
  };

  deleteNote = id => {
    console.log(id)
    const { notes, newNote, idRoute } = this.state;
    console.log("NOTES IN DELETENOTE", notes);
    const delArr = notes.filter(note => note._id === id);
    // axios.delete(`https://frozen-hamlet-56840.herokuapp.com/notes/${idRoute}`, delArr.id )
    console.log("ID???", delArr);
    axios.delete(`http://localhost:5000/notes/${id}`, delArr.id )
    this.setState({ notes: delArr });
    console.log(delArr);
  };

  render() {
    return (
      <div className="App">
        <SideBar />
        <Route
          path="/signup"
          render={props => <Signup onSignin={this.signInSuccess} />}
        />
        <Route
          path="/signin"
          render={props => <Signin onSignin={this.signInSuccess} />}
        />
        <Route
          exact
          path="/"
          render={props => (
            <NoteContainer onLoad={this.noteFetch} state={this.state} />
          )}
        />
        <LoginChecker path="/addNote" render={this.renderNoteView} />
        <Route path="/viewNote/:id" render={this.indivNoteView} />
        <Route path="/editNote/:id" render={this.editNoteView} />
      </div>
    );
  }
  noteFetch = async () => {
    try {
      let idRoute = localStorage.getItem("user._id");
      const response = await axios.get(
        // `https://frozen-hamlet-56840.herokuapp.com/notes/${idRoute}`
        `http://localhost:5000/notes/${idRoute}`
      );
      console.log(response);
      this.setState({ notes: response.data.notes });
      console.log(this.state);
      return;
    } catch (err) {
      console.log(err.message);
    }
  };
  signInSuccess = data => {
    this.setState({ user: data.user });
    localStorage.setItem("authtoken", data.token);
    console.log(this.state);
  };
}

export default App;
