import { ProxyActions, ProxyActionTypes } from './proxy.actions';
import { ClientHttpRequest, ClientHttpResponse } from 'proxy';


export interface ProxyState {
  exchanges: { [id: string]: ExchangeState };
  selected: string;
}

export interface ExchangeState extends ClientHttpRequest {

  id: string;

  response: ClientHttpResponse;
  modifiedResponse: ClientHttpResponse;

  pending: boolean;
  modified: boolean;
}

const initialState: ProxyState = {
  exchanges: {},
  selected: null
};

export function reducer(state = initialState, action: ProxyActions): ProxyState {
  switch (action.type) {

    case ProxyActionTypes.AddRequest: {

      return state.exchanges[action.id] ? state : {
        ...state,
        exchanges: {
          ...state.exchanges,
          [action.id]: {
            ...action.payload,
            id: action.id,
            response: null,
            pending: true,
            modifiedResponse: null,
            modified: false
          }
        }
      };
    }

    case ProxyActionTypes.UpdateExchange: {
      return {
        ...state,
        exchanges: {
          ...state.exchanges,
          [action.id]: { ...state.exchanges[action.id], ...action.payload }
        }
      };
    }

    case ProxyActionTypes.AddResponse: {
      return {
        ...state,
        exchanges: {
          ...state.exchanges,
          [action.id]: {
            ...state.exchanges[action.id],
            response: action.payload,
            modifiedResponse: action.payload,
            modified: false,
            pending: false
          }
        }
      };
    }

    case ProxyActionTypes.AddModifiedResponse: {
      return {
        ...state,
        exchanges: {
          ...state.exchanges,
          [action.id]: {
            ...state.exchanges[action.id],
            modifiedResponse: action.payload,
            modified: true
          }
        }
      };
    }

    case ProxyActionTypes.SelectExchange: {
      return {
        ...state,
        selected: action.id
      };
    }

    case ProxyActionTypes.ResetModifiedRequest: {
      return {
        ...state,
        exchanges: {
          ...state.exchanges,
          [action.id]: {
            ...state.exchanges[action.id],
            modifiedResponse: { ...state.exchanges[action.id].response },
            modified: false
          }
        }
      };
    }

    case ProxyActionTypes.ClearRequests: {
      return {
        exchanges: {},
        selected: null
      };
    }

    default: {
      return state;
    }

  }
}
