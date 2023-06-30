const translations = {
    ru: {
        correct: 'RSS успешно загружен',
        error: 'Ссылка должна быть валидным URL',
        dublicate: 'RSS уже существует',
        networkErr: 'Ошибка сети',
        parseErr: 'Ресурс не содержит валидный RSS',
        label: 'Ссылка RSS',
        btn: 'Добавить',
        lead: 'Начните читать RSS сегодня! Это легко, это красиво.',
        agreg: 'RSS агрегатор',
        muted: 'Пример: https://ru.hexlet.io/lessons.rss',
    },
    en: {
        correct: 'RSS successfully loaded',
        error: 'The link must be a valid URL',
        dublicate: 'RSS already here',
        networkErr: 'Problems with the network, try again later, please',
        parseErr: 'An error occurred during data processing',
        label: 'link RSS',
        btn: 'Add',
        lead: 'Start to read RSS today! Easy and beautiful.',
        agreg: 'RSS aggregator',
        muted: 'Example: https://ru.hexlet.io/lessons.rss',
    },
};

export default {
    ru: translations.ru,
    en: translations.en,
};
