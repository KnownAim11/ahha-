# Инструкции по отправке кода на GitHub

Код подготовлен к отправке на GitHub. Для завершения процесса требуется аутентификация.

## Вариант 1: Использование Personal Access Token (рекомендуется)

1. Создайте Personal Access Token на GitHub:
   - Перейдите на https://github.com/settings/tokens
   - Нажмите "Generate new token" → "Generate new token (classic)"
   - Дайте токену имя (например, "ahha-project")
   - Выберите права доступа: `repo` (полный доступ к репозиториям)
   - Скопируйте токен (он показывается только один раз!)

2. Отправьте код одной из следующих команд:

```bash
cd "/Users/max/Desktop/untitled folder"
git push -u origin main
```

Когда система запросит:
- **Username**: `KnownAim11`
- **Password**: вставьте ваш Personal Access Token (не пароль GitHub!)

## Вариант 2: Использование SSH ключа

Если у вас уже настроен SSH ключ для GitHub:

```bash
cd "/Users/max/Desktop/untitled folder"
git remote set-url origin git@github.com:KnownAim11/ahha-.git
git push -u origin main
```

Если SSH ключ не настроен:
1. Создайте SSH ключ: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Добавьте ключ в ssh-agent: `eval "$(ssh-agent -s)"` и `ssh-add ~/.ssh/id_ed25519`
3. Скопируйте публичный ключ: `cat ~/.ssh/id_ed25519.pub`
4. Добавьте ключ на GitHub: https://github.com/settings/keys

## Вариант 3: Использование GitHub CLI

Если у вас установлен GitHub CLI (`gh`):

```bash
cd "/Users/max/Desktop/untitled folder"
gh auth login
git push -u origin main
```

## Текущий статус

✅ Git репозиторий инициализирован
✅ Все файлы добавлены (665 файлов)
✅ Коммит создан: "Initial commit: Add AHHA website files"
✅ Remote origin настроен: https://github.com/KnownAim11/ahha-.git
⏳ Требуется аутентификация для push

После успешной аутентификации код будет отправлен в ваш репозиторий!

