import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

//Сервлет для создания новой записи в БД
@WebServlet("/CreateServlet")
public class CreateServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //устанавливаем тип контента для получения JSON
        response.setContentType("application/json");
        //кодировки
        request.setCharacterEncoding("UTF-8");

        //получение хэдера с данными - JSON строкой
        String jsonStr = request.getHeader("Content-type");

        //парсим JSON строку в объект с помощью POJO класса CourseInfo
        Gson gson = new Gson();
        CourseInfo courseInfoPOJO = gson.fromJson(jsonStr, CourseInfo.class);

        //создаем экземпляр DataBase для вызова методов работы с БД
        DataBase db = new DataBase();
        //добавляем полученную из формы информацию в БД
        try {
            db.Create(courseInfoPOJO);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

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
