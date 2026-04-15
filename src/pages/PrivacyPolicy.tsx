import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/icon'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-neutral-400 hover:text-[#8BC34A] transition-colors mb-8 text-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Вернуться на сайт
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Icon name="TreePine" size={32} className="text-[#8BC34A]" />
          <span className="text-white font-bold text-2xl tracking-tight">ЛесСтрой Карелия</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Политика конфиденциальности</h1>
        <p className="text-neutral-400 text-sm mb-10">Последнее обновление: апрель 2026 г.</p>

        <div className="space-y-8 text-neutral-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки персональных данных пользователей сайта компании «ЛесСтрой Карелия» (далее — «Оператор») в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
            </p>
            <p className="mt-3">
              Использование сайта и отправка заявки означают безоговорочное согласие с настоящей Политикой.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Оператор персональных данных</h2>
            <p>Наименование: ЛесСтрой Карелия</p>
            <p className="mt-1">Деятельность: строительство и лесозаготовка в Карелии</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Состав персональных данных</h2>
            <p>Оператор обрабатывает следующие персональные данные, добровольно предоставленные пользователем при заполнении формы заявки:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Имя (фамилия, имя, отчество)</li>
              <li>Номер телефона</li>
              <li>Текст обращения (при наличии)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Цели обработки персональных данных</h2>
            <p>Персональные данные обрабатываются в следующих целях:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Обратная связь с пользователем по его запросу</li>
              <li>Подготовка и направление коммерческого предложения</li>
              <li>Заключение и исполнение договора на выполнение работ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Правовое основание обработки</h2>
            <p>
              Правовым основанием обработки персональных данных является согласие субъекта персональных данных (ст. 6, ч. 1, п. 1 Федерального закона № 152-ФЗ), выраженное путём проставления отметки в форме обратной связи на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Порядок обработки и хранения данных</h2>
            <p>
              Оператор обязуется не передавать персональные данные пользователей третьим лицам без их согласия, за исключением случаев, предусмотренных законодательством Российской Федерации.
            </p>
            <p className="mt-3">
              Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, но не более 3 (трёх) лет с момента получения согласия, если иное не предусмотрено законодательством.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Права субъекта персональных данных</h2>
            <p>Пользователь имеет право:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Получить информацию об обработке своих персональных данных</li>
              <li>Требовать уточнения, блокировки или уничтожения персональных данных</li>
              <li>Отозвать согласие на обработку персональных данных</li>
              <li>Обжаловать действия Оператора в Роскомнадзоре</li>
            </ul>
            <p className="mt-3">
              Для реализации указанных прав необходимо направить письменный запрос по контактным данным, указанным на сайте.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Безопасность данных</h2>
            <p>
              Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Изменение Политики</h2>
            <p>
              Оператор оставляет за собой право вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента её размещения на сайте.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-neutral-500 text-sm">
          © 2026 ЛесСтрой Карелия. Все права защищены.
        </div>
      </div>
    </div>
  )
}
