/**
 * Created by csergey on 26.11.16.
 */

var scoperang = (scope) => {
    if(scope < -35){
        return "Выброси телефон"
    }
    else if(scope < -30){
        return "Удали телеграм"
    }
    else if(scope < -25){
        return "Закрой бота"
    }
    else if(scope < -20){
        return "Лузер"
    }else if (scope < -15){
        return "Неудачник"
    }else if(scope < -10){
        return "Не уверенный"
    }else if(scope < -5){
        return "Не эксперт"
    }else if(scope < 0){
        return "Оступились"
    }else  if (scope < 5){
        return "Повезло"
    }else  if (scope < 10){
        return "Знающий"
    }else  if (scope < 15){
        return "Умный"
    }else  if (scope < 20){
        return "Мастер"
    }else  if (scope < 25){
        return "Эксперт"
    }else  if (scope < 30){
        return "Титан"
    }else  if (scope < 35){
        return "Бог машин"
    }else  if (scope < 45){
        return "AcademeG"
    }else  if (scope < 50){
        return "Директор Aвтоваза"
    }else  if (scope < 55){
        return "Счастливый"
    }else  if (scope < 60){
        return "Пользователь drom"
    }else  if (scope < 65){
        return "Эрудит"
    }else  if (scope < 70){
        return "Пол Уокер"
    }else  if (scope < 75){
        return "Ветеран Need for Speed"
    }else  if (scope < 80){
        return "Наблюдательный"
    }else  if (scope < 85){
        return "Фанат машин"
    }else  if (scope < 90){
        return "Механик"
    }else  if (scope < 95){
        return "Вин Дизедь"
    }else  if (scope < 100){
        return "Автомабильный маньяк"
    } else {
        return "Эрик Давидович"
    }
}

module.exports = scoperang