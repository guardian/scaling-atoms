import React from 'react';
import {CommonsDivisionPropType} from '../../actions/ParliamentActions/getLatestCommonsDivisions.js';
import {atomPropType} from '../../constants/atomPropType';
import AtomsApi from '../../services/AtomsApi';
import {commonsDivision} from '../../services/Parliament';
import moment from 'moment';

const StatusTypes = {
  DISPLAY: "DISPLAY",               //display either "Create atom" button or "Edit atom" link
  RETRIEVE_VOTES: "RETRIEVE_VOTES", //getting the vote data from parliament api
  CREATE: "CREATE",                 //creating a new default atom
  UPDATE: "UPDATE",                 //adding the vote data to the atom
  ERROR:  "ERROR"
};

class CommonsDivision extends React.Component {
  static propTypes = {
    division: CommonsDivisionPropType,
    atom: atomPropType
  };

  state = {
    status: StatusTypes.DISPLAY,
    division: this.props.division,
    atom: this.props.atom
  };

  //Order by second name while building up the MP lists.
  compareSecondNames = (a, b) => a.split(" ").pop() > b.split(" ").pop();
  insertMP(mp, arr, start, end) {
    if (start >= end) {
      if (arr[start] && this.compareSecondNames(mp.name, arr[start].name)) arr.splice(start+1, 0, mp);
      else arr.splice(start, 0, mp);
    } else {
      const pivot = Math.floor((start + end) / 2);
      if (this.compareSecondNames(mp.name, arr[pivot].name)) this.insertMP(mp, arr, pivot+1, end);
      else this.insertMP(mp, arr, start, pivot-1);
    }
  }

  cleanPartyName(name) {
    switch (name) {
      case "Labour (Co-op)":
        return "Labour";
      default:
        return name;
    }
  }

  retrieveVotes(id) {
    this.setState(Object.assign({}, this.state, {
      status: StatusTypes.RETRIEVE_VOTES
    }));

    //Add the votes to the division then create an atom
    commonsDivision(id).then(data => {
      const raw = data.result.primaryTopic;
      const parliamentId = raw["_about"].split("/").pop();

      const division = {
        parliamentId: parliamentId,
        date: raw.date["_value"],
        title: raw.title,
        votes: {
          ayes: [],
          noes: []
        }
      };

      raw.vote.forEach(vote => {
        const type = vote.type.split("#").pop();
        const mp = {
          name: vote.memberPrinted["_value"],
          party: this.cleanPartyName(vote.memberParty)
        };

        if (type === "AyeVote") this.insertMP(mp, division.votes.ayes, 0, division.votes.ayes.length-1);
        else if (type === "NoVote") this.insertMP(mp, division.votes.noes, 0, division.votes.noes.length-1);
      });

      this.setState(Object.assign({}, this.state, {
        division: division,
        status: StatusTypes.CREATE
      }));

      this.createAtom();
    });
  }

  createAtom() {
    const id = `division-${this.state.division.parliamentId}`;

    AtomsApi.createAtom("commonsdivision", {
      title: this.state.division.title,
      id: id,
      commissioningDesks: []
    }).then(res => res.json())
      .then(atom => {
        this.setState(Object.assign({}, this.state, {
          atom: atom,
          status: StatusTypes.UPDATE
        }));

        this.updateAtom();
      });
  }

  updateAtom() {
    const date = moment(this.state.division.date, "YYYY-MM-DD", true);

    const updatedAtom = Object.assign({}, this.state.atom, {
      data: {
        commonsDivision: {
          parliamentId: this.state.division.parliamentId,
          date: date.valueOf(),
          votes: this.state.division.votes
        }
      }
    });

    AtomsApi.updateAtom(updatedAtom)
      .then(res => res.json())
      .then(atom => {
        this.setState(Object.assign({}, this.state, {
          atom: atom,
          status: StatusTypes.DISPLAY
        }));
      });
  }

  renderAtomLink(atom) {
    const workshopUrl = `/atoms/commonsdivision/${atom.id}/edit`;
    return (
      <a className="atom-list__link" href={workshopUrl}>Edit atom</a>
    );
  }

  renderCreateButton(id) {
    return (
      <button className="btn" onClick={this.retrieveVotes.bind(this, id)}>Create atom</button>
    );
  }

  /**
   * Depending on the current state, the management div may contain:
   * 1. 'Create atom' button
   * 2. 'Edit atom' link
   * 3. A status message indicating progress of atom creation from parliament api data
   */
  renderManagement() {
    switch (this.state.status) {
      case StatusTypes.RETRIEVE_VOTES:
        return (<div>Retrieving votes...</div>);

      case StatusTypes.CREATE:
        return (<div>Creating atom...</div>);

      case StatusTypes.UPDATE:
        return (<div>Adding votes...</div>);

      case StatusTypes.DISPLAY:
        return (
          <div
            className="divisions-action"> {
            this.state.atom ? this.renderAtomLink(this.state.atom) : this.renderCreateButton(this.state.division.parliamentId)
          }
          </div>
        );
      case StatusTypes.ERROR:
        return (<div>Error creating atom</div>);
    }
  }

  render() {
    return (
      <li className="divisions-list__item" key={this.state.division.parliamentId}>
        <div className="divisions-description">{this.state.division.date} - <span className="divisions-list__item__title">{this.state.division.title}</span></div>
        {this.renderManagement.bind(this)()}
      </li>
    );
  }
}

export default CommonsDivision;
