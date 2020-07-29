import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

//Сервлет для чтения данных из БД
@WebServlet("/DisplayServlet")
public class DisplayServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //устанавливаем тип контента для получения JSON
        response.setContentType("application/json");
        //кодировки
        request.setCharacterEncoding("UTF-8");
        //получение хэдера с данными
        String str = request.getHeader("Content-type");

        //если запрос поступил сразу после загрузки страницы
        if (str.equals("pageOnload"))
        {
            //создаем экземпляр DataBase для вызова одного из методов-операций над БД
            DataBase db = new DataBase();

            //формируем новый JSON для отправки на JS
            GsonBuilder builder = new GsonBuilder();
            Gson gsonBuilder = builder.create();
            String newJson = null;
            //формируем новую строку JSON
            try {
                //читаем всю информацию из БД (Read() вернёт HashMap с информацией). Парсим её в JSON строку
                newJson = gsonBuilder.toJson(db.Read());
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }

            PrintWriter writer = response.getWriter();
            try {
                writer.print(newJson); //возвращаем JS новую JSON строку
            } finally {
                writer.close();
            }
        }
    }
}
