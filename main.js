const initialState = {
  clothesItems: ['Apron', 'Belt', 'Cardigan', 'Dress', 'Earrings', 'Fur coat', 'Gloves', 'Hat'],
	index: null,
	inputText: null
};

const clicked = inputText => {
  return {
    type: 'click_edit',
    inputText
  }
};

const pressEnter = inputText => {
  return {
    type: 'click_enter',
    inputText
  }
};

const removeItem = () => {
  return {
    type: 'remove_item'
  }
};

const exitFrom = () => {
  return {
      type: 'exit_from_input'
  }
};

function getNextState(state, action) {
  switch (action.type) {
    case 'click_edit':
      return {
        ...state,
        index: state.clothesItems.indexOf(action.inputText),
        inputText: action.inputText
      };
    case 'click_enter':
        return {
          ...state,
          clothesItems: state.clothesItems.map(item => {
            return state.clothesItems.indexOf(item) === state.index
                  ? action.inputText
                  : item;
          }),
          index: null,
          inputText: ''
        };
    case 'remove_item':
      return {
        ...state,
        clothesItems: state.clothesItems.filter(item => {
          return state.clothesItems.indexOf(item) !== state.index;
        }),
        index: null,
        inputText: ''
      }
    case 'exit_from_input':
      return {
        ...state,
        index: null,
        inputText: null
      }
    default:
      return state;
    }
}

const store = Redux.createStore(getNextState, initialState);

function render() {
  let container = document.querySelector('.clothes');
  container.innerHTML = '';

  store.getState().clothesItems.forEach(item => {
    let listItem = document.createElement('li');
    listItem.textContent = item;

    if (store.getState().inputText !== item) {
      const button = document.createElement('button');
      button.textContent = 'Edit';
      listItem.append(button);

      button.addEventListener('click', () => {
        store.dispatch(clicked(item));
      });
    } else {
      const input = document.createElement('input');
      input.value = item;
      input.autofocus = true;
      listItem.append(input);

      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter') {
          return;
        };

        if (event.target.value.trim() === '') {
          store.dispatch(removeItem());
        }

        store.dispatch(pressEnter(event.target.value.trim()));
      });
    }

    container.append(listItem);
  });
}

store.subscribe(() => {
  render();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('button') && !event.target.closest('input')) {
	  store.dispatch(exitFrom());
  }
})

document.addEventListener('load', render());
