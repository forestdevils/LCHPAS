// Функція для відображення паспорта (винесена окремо для зручності)
function displayPassport(user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('passport').style.display = 'block';

    document.getElementById('logout-container').style.display = 'block';

    document.getElementById('p-id').innerText = `№ ${user.id.toString().padStart(3, '0')}`;
    document.getElementById('p-nick').innerText = user.username;
    document.getElementById('p-rank').innerText = user.party_rank || 'Рядовий';
    document.getElementById('p-link').href = user.profile_url;

    const userPhoto = document.querySelector('.photo-space img');
    if (user.avatar_url) {
        userPhoto.src = user.avatar_url;
        userPhoto.style.opacity = "1";
        userPhoto.style.width = "100%";
        userPhoto.style.objectFit = "cover";
    }

    document.getElementById('p-salary').innerText = user.salary || '0';
    document.getElementById('p-battalion').innerText = user.battalion || 'Не призначено';
    document.getElementById('p-tg').innerText = user.telegram || 'Відсутній';

    const pos1 = user.additional_position_1 || '---';
    const pos2 = user.additional_position_2 || '---';
    document.getElementById('p-positions').innerText = `${pos1} / ${pos2}`;

    const addSal = user.additional_salary ? `${user.additional_salary}` : '0';
    const expl = user.explanation_of_addsal ? ` (${user.explanation_of_addsal})` : '';
    document.getElementById('p-add-salary').innerText = addSal + expl;
}

// ПЕРЕВІРКА СЕСІЇ ПРИ ЗАВАНТАЖЕННІ
window.onload = function() {
    const savedData = localStorage.getItem('userSession');
    if (savedData) {
        const session = JSON.parse(savedData);
        const now = new Date().getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (now - session.timestamp < sevenDays) {
            displayPassport(session.user);
        } else {
            localStorage.removeItem('userSession');
        }
    }
};

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) return alert('Заповніть поля');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Зберігаємо в localStorage на 7 днів
            const sessionData = {
                user: data.user,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('userSession', JSON.stringify(sessionData));

            displayPassport(data.user);
        } else {
            alert('Помилка: ' + data.message);
        }
    } catch (err) {
        alert('Сервер не відповідає');
    }
}

function logout() {
    localStorage.removeItem('userSession');
    document.getElementById('logout-container').style.display = 'none';
    location.reload(); // Перезавантажуємо сторінку, щоб повернутись до логіну
}

function toggleExtraInfo() {
    const extra = document.getElementById('extra-info');
    const btn = document.getElementById('toggle-btn');
    extra.style.display = (extra.style.display === 'block') ? 'none' : 'block';
    btn.innerText = (extra.style.display === 'block') ? 'ПРИХОВАТИ ↑' : 'ПОКАЗАТИ БІЛЬШЕ ↓';
}