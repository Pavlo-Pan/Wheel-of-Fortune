const variables = [];
// Массив для хранения переменных, которые пользователь добавляет для колеса.

const canvas = document.getElementById('wheelCanvas');
// Получаем элемент <canvas>, который будет использоваться для отображения колеса.

const ctx = canvas.getContext('2d');
// Устанавливаем контекст рисования 2D для работы с графикой.

let spinning = false;
// Флаг для отслеживания того, происходит ли сейчас вращение колеса.

let currentAngle = 0;
// Текущий угол поворота колеса.

const colors = [
    "#FFB3BA", // розовый пастельный
    "#FFDFBA", // персиковый пастельный
    "#FFFFBA", // жёлтый пастельный
    "#BAFFC9", // зелёный пастельный
    "#BAE1FF", // голубой пастельный
    "#E6BEFF", // сиреневый пастельный
    "#FFC4C4", // светло-коралловый пастельный
    "#FFF2CC", // кремовый пастельный
    "#B2D8D8", // мятный пастельный
    "#D5A6BD", // розово-лавандовый пастельный
    "#D5E8D4", // светло-зелёный пастельный
    "#C9DAF8", // нежно-голубой пастельный
    "#F9CB9C", // персиково-кремовый пастельный
    "#F6E3CE", // светло-оранжевый пастельный
    "#FFEAD0", // шампань пастельный
    "#D9D2E9"  // фиолетовый лавандовый пастельный
];
// Массив цветов, используемых для раскраски сегментов колеса.

function drawWheel() {
    const numSegments = variables.length;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (numSegments === 0) {
        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '20px Arial';
        ctx.fillText('Добавьте переменные', radius, radius);
        return;
    }

    const angleStep = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        const startAngle = currentAngle + i * angleStep;
        const endAngle = startAngle + angleStep;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.font = '16px Arial';
        ctx.fillText(variables[i], radius - 10, 0);
        ctx.restore();
    }
}

function addVariable() {
    const input = document.getElementById('inputVariable');
    const value = input.value.trim();

    if (value === '') {
        alert('Введите переменную!');
        return;
    }

    variables.push(value);
    input.value = '';
    currentAngle = 0; // Сбрасываем текущий угол
    updateVariableList();
    drawWheel();
}

document.getElementById("inputVariable").addEventListener("keydown", function (event) {
    // Добавляем слушатель для ввода с клавиатуры. Если нажата клавиша "Enter", вызываем addVariable.
    if (event.key === "Enter") {
        addVariable();
    }
});

function clearVariables() {
    // Функция для очистки всех переменных.
    variables.length = 0;
    // Очищаем массив переменных.

    updateVariableList();
    // Обновляем отображение списка переменных.

    drawWheel();
    // Перерисовываем пустое колесо.
}

function updateVariableList() {
    // Функция для обновления списка переменных в DOM.
    const list = document.getElementById('variableList');
    // Получаем элемент списка.

    list.innerHTML = '';
    // Очищаем текущий список.

    variables.forEach((variable, index) => {
        // Для каждой переменной создаём элемент списка.
        const li = document.createElement('li');
        li.textContent = variable;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.style.marginLeft = '10px';
        removeButton.onclick = () => removeVariable(index);
        // Кнопка для удаления переменной.

        li.appendChild(removeButton);
        list.appendChild(li);
    });
}

function removeVariable(index) {
    variables.splice(index, 1);
    currentAngle = 0; // Сбрасываем текущий угол
    updateVariableList();
    drawWheel();
}
function spinWheel() {
    if (variables.length === 0) {
        alert('Добавьте хотя бы одну переменную для вращения!');
        return;
    }

    if (spinning) return;

    spinning = true;

    const spinAngle = Math.random() * 360 + 3600; // Случайный угол вращения (10+ оборотов)
    const spinDuration = 5000; // Длительность вращения (5 секунд)
    const startTime = performance.now(); // Время начала вращения
    const angleStep = 360 / variables.length; // Угол одного сегмента

    const selectionAngle = 90; // Угол выбора (в градусах). По умолчанию 0°, но можно изменить на любой другой.

    function animateSpin(time) {
        const elapsedTime = time - startTime;
        const angle = easeOutCubic(elapsedTime, 0, spinAngle, spinDuration); // Угол вращения с easing
        currentAngle = (angle * Math.PI) / 180; // Преобразуем угол в радианы
        drawWheel();

        if (elapsedTime < spinDuration) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;

            const finalAngle = (spinAngle % 360 + 360) % 360; // Угол вращения в диапазоне 0-360
            const adjustedAngle = (selectionAngle - finalAngle + 360) % 360; // Корректируем для угла выбора

            // Определяем индекс выбранного сегмента
            const chosenIndex = Math.floor(adjustedAngle / angleStep);

            alert(`Выбранный элемент: ${variables[chosenIndex]}`);
        }
    }

    requestAnimationFrame(animateSpin);
}
document.addEventListener("keydown", function (event) {
    // Слушатель глобальных клавиш. При нажатии Ctrl + '.' имитируется клик на кнопку вращения.
    if (event.ctrlKey && event.key === "Shift") {
        document.getElementById("twist").click();
    }
});

function easeOutCubic(t, b, c, d) {
    // Функция easing для плавного замедления вращения.
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

drawWheel();
// Изначальная отрисовка пустого колеса.
