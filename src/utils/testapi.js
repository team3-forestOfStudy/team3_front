const BASE_URL = 'http://172.30.1.30:4000/api/';

export async function getStudyList(id) {
  const response = await fetch(`${BASE_URL}studies/${id}`);
  const body = await response.json();
  return body;
}

export async function deleteStudyList(id, password) {
  const response = await fetch(`${BASE_URL}studies/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: password,
    }),
  });

  const body = await response.json();
  return body;
}

// export async function postStudyListEmoji(emojiformData) {
//   const response = await fetch(`http://172.30.1.30:4000/api/studies/3/emojis`, {
//     method: 'POST',

//     body: emojiformData,
//   });
//   const body = await response.json();
//   return body;
// }

// 이모지 추가하는 api

export async function postStudyListEmoji(id, emojiCode) {
  try {
    const response = await fetch(`${BASE_URL}studies/${id}/emojis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emojiCode }), // JSON 형식으로 보내기
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error('Error posting emoji:', error);
    return null;
  }
}

// 이모지 조회하는 api

export async function getStudyListEmoji(id) {
  const response = await fetch(`${BASE_URL}studies/${id}/emojis`);
  const body = await response.json();
  return body;
}
