export async function sendMsgToOpenAI(msg, selectedModel, imageData) {
  try {
    const response = await fetch('http://localhost:8000/askAI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ msg, selectedModel, imageData })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return 'Error processing request';
  }
}

export async function getChats() {
  try {
    const response = await fetch('http://localhost:8000/chats', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching chats');
  }
}


export async function deleteChats() {
  try {
    const response = await fetch('http://localhost:8000/delete', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
      throw new Error('Error deleting chats');
  }
}