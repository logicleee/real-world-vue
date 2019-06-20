import EventService from '@/services/EventService'

function shortDate(date) {
  if (date != '' && date.length > 9) return date.slice('', 10)
  return 'none'
}

export const namespaced = true
export const state = {
  events: [],
  event: {},
  eventsTotalCount: 0,
  perPage: 3
}

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  SET_EVENTS(state, events) {
    events.forEach((event) => {
      if (!event.shortDate) event.shortDate = shortDate(event.date)
    })
    state.events = events
  },
  SET_EVENTS_TOTAL_COUNT(state, count) {
    state.eventsTotalCount = count
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit('ADD_EVENT', event)
        commit('SET_EVENT', event)
        const notification = {
          type: 'success',
          message: 'Your event has been created!'
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your event: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchEvents({ commit, dispatch, state }, { page }) {
    return EventService.getEvents(state.perPage, page)
      .then((response) => {
        commit(
          'SET_EVENTS_TOTAL_COUNT',
          parseInt(response.headers['x-total-count'])
        )
        commit('SET_EVENTS', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
      })
  },

  // eslint-disable-next-line
  fetchEvent({ commit, getters, state }, id) {
    if (id == state.event.id) {
      return state.event
    }

    let event = getters.getEventById(id)

    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      return EventService.getEvent(id).then((response) => {
        commit('SET_EVENT', response.data)
        return response.data
      })
    }
  }
}

export const getters = {
  categoriesLength: (state) => (state.categories ? state.categories.length : 0),
  getEventById: (state) => (id) => state.events.find((event) => event.id === id)
}
