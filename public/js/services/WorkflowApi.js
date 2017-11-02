import { pandaFetch } from './pandaFetch';
import {getStore} from '../util/storeAccessor';
import _ from 'lodash';
import getProductionOffice from '../util/getProductionOffice';
import moment from 'moment';

function getWorkflowUrl() { return getStore().getState().config.workflowUrl; }

export default {

  trackInWorkflow: (atom, section, scheduledLaunchDate, status) => {

    const getWorkflowPayload = (atom, section, scheduledLaunchDate, status) => {

      const prodOffice = getProductionOffice();

      const data = {
        contentType: _.camelCase(atom.atomType),
        editorId: atom.id,
        title: atom.title,
        priority: 0,
        needsLegal: 'NA',
        section: section,
        status: status,
        prodOffice: prodOffice,
      };

      if (!scheduledLaunchDate) {
        return data;
      }

      const momentLaunchDate = moment(scheduledLaunchDate);
      return Object.assign({}, data, {
        scheduledLaunchDate: moment(momentLaunchDate),
        note: `Launching ${momentLaunchDate.format("DD MMM YYYY HH:mm")}`
      });
    };

    const workflowUrl = getWorkflowUrl();
    const payload = getWorkflowPayload(atom, section, scheduledLaunchDate, status);

    return pandaFetch(
      `${workflowUrl}/api/stubs`,
      {
        method: 'post',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },

  getSections() {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
      `${workflowUrl}/api/sections`,
      {
        method: 'get',
        credentials: 'include',
        mode: 'cors',
        cache: 'default'
      }
    ).then(response => {
      return response.json();
    }).then(sections => {
      return _.orderBy(sections.data, 'name');
    });
  },

  getWorkflowStatus: (atom) => {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
        `${workflowUrl}/api/atom/${atom.id}`,
        {
          method: 'get',
          credentials: 'include',
          mode: 'cors',
          cache: 'default'
        }
        ).then(response => {
          return response.json();
        });
  },

  getTrackableAtomTypes: () => {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
        `${workflowUrl}/api/allowedAtomTypes`,
        {
          method: 'get',
          credentials: 'include',
          mode: 'cors',
          cache: 'default'
        }
        ).then(response => {
          return response.json();
        });
  }

};
