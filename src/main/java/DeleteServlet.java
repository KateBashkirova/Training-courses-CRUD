import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

//Сервлет для удаления данных из БД
@WebServlet("/DeleteServlet")
public class DeleteServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //устанавливаем тип контента для получения JSON
        response.setContentType("application/json");
        //кодировки
        request.setCharacterEncoding("UTF-8");
        //получение хэдера с данными
        String idCourse = request.getHeader("Content-type");

        //создаем экземпляр DataBase для вызова одного из методов-операций над БД
        DataBase db = new DataBase();

        //Удаляем из БД запись с id = idCourse
        try { db.Delete(idCourse); }
        catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
