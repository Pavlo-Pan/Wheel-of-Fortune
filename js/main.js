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
    // Функция для отрисовки колеса.
    const numSegments = variables.length;
    // Количество сегментов определяется числом добавленных переменных.

    const radius = canvas.width / 2;
    // Радиус колеса, равен половине ширины canvas.

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Очищаем весь canvas перед рисованием.

    if (numSegments === 0) {
        // Если переменные не добавлены, показываем сообщение "Добавьте переменные".
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
    // Угол одного сегмента колеса.

    for (let i = 0; i < numSegments; i++) {
        // Цикл для отрисовки каждого сегмента.
        const startAngle = currentAngle + i * angleStep;
        // Начальный угол сегмента.
        const endAngle = startAngle + angleStep;
        // Конечный угол сегмента.

        ctx.fillStyle = colors[i % colors.length];
        // Цвет сегмента берётся из массива цветов по циклу.

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        // Рисуем сегмент.

        ctx.fillStyle = '#000';
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.font = '16px Arial';
        ctx.fillText(variables[i], radius - 10, 0);
        ctx.restore();
        // Добавляем текст (имя переменной) в сегмент.
    }
}

function addVariable() {
    // Функция для добавления переменной в массив.
    const input = document.getElementById('inputVariable');
    // Получаем поле ввода.

    const value = input.value.trim();
    // Забираем текст из поля ввода, удаляя пробелы.

    if (value === '') {
        // Если текст пустой, показываем предупреждение.
        alert('Введите переменную!');
        return;
    }

    variables.push(value);
    // Добавляем переменную в массив.

    input.value = '';
    // Очищаем поле ввода.

    updateVariableList();
    // Обновляем список переменных.

    drawWheel();
    // Перерисовываем колесо.
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
    // Функция для удаления переменной из массива.
    variables.splice(index, 1);
    // Удаляем переменную по индексу.

    updateVariableList();
    // Обновляем список переменных.

    drawWheel();
    // Перерисовываем колесо.
}

function spinWheel() {
    // Функция для запуска вращения колеса.
    if (variables.length === 0) {
        // Если переменные не добавлены, показываем предупреждение.
        alert('Добавьте хотя бы одну переменную для вращения!');
        return;
    }

    if (spinning) return;
    // Если колесо уже вращается, игнорируем повторный вызов.

    spinning = true;
    const spinAngle = Math.random() * 360 + 3600;
    // Рассчитываем случайный угол вращения (минимум 10 оборотов).

    const spinDuration = 5000;
    // Длительность вращения (5 секунд).

    const startTime = performance.now();
    // Время начала вращения.

    const angleStep = 360 / variables.length;
    // Угол одного сегмента.

    function animateSpin(time) {
        // Функция анимации вращения.
        const elapsedTime = time - startTime;
        // Сколько времени прошло.

        const angle = easeOutCubic(elapsedTime, 0, spinAngle, spinDuration);
        // Рассчитываем текущий угол с использованием функции easing.

        currentAngle = (angle * Math.PI) / 180;
        // Преобразуем угол в радианы.

        drawWheel();
        // Перерисовываем колесо.

        if (elapsedTime < spinDuration) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            const finalAngle = (spinAngle % 360 + 360) % 360;
            // Вычисляем конечный угол.

            const chosenIndex = Math.floor((variables.length - Math.floor(finalAngle / angleStep)) % variables.length);
            // Определяем индекс выбранного сегмента.

            // alert(`Выбранный элемент: ${variables[chosenIndex]}`);
            // Показываем выбранную переменную.
        }
    }

    requestAnimationFrame(animateSpin);
    // Запускаем анимацию.
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
