import EventService from '@/services/EventService';

export const namespaced = true;
export const state = {
  events: [],
  event: {},
  eventsTotalCount: 0
};
export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENTS_TOTAL_COUNT(state, count) {
    state.eventsTotalCount = count;
  },
  SET_EVENT(state, event) {
    state.event = event;
  }
};
export const actions = {
  createEvent({ commit }, event) {
    return EventService.postEvent(event).then(() => {
      commit('ADD_EVENT', event);
    });
  },
  fetchEvents({ commit }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then((response) => {
        commit(
          'SET_EVENTS_TOTAL_COUNT',
          parseInt(response.headers['x-total-count'])
        );
        commit('SET_EVENTS', response.data);
      })
      .catch((error) => {
        console.log('There was an error:', error.response);
      });
  },
  fetchEvent({ commit, getters }, id) {
    const event = getters.getEventById(id);

    if (event) {
      commit('SET_EVENT', event);
    } else {
      EventService.getEvent(id)
        .then((response) => {
          commit('SET_EVENT', response.data);
        })
        .catch((error) => {
          console.log('there was an error:', error.response);
        });
    }
  }
};

export const getters = {
  categoriesLength: (state) => state.categories.length,
  getEventById: (state) => (id) => state.events.find((event) => event.id === id)
};
