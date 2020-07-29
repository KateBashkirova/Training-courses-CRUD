import java.sql.*;
import java.util.HashMap;

public class DataBase {
    //адрес для подсоединения к БД
    private final String url="jdbc:mysql://localhost/availablecourses?serverTimezone=Europe/Moscow&useSSL=false";

    //Создать записи в БД
    public void Create(CourseInfo courseInfo) throws ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        //пытаемся установить соединение с БД
        try {
            Connection connection = DriverManager.getConnection(url, "root", "2500");
            //если соединение с БД установлено
            if (!connection.isClosed()) {
                System.out.println("Connection complete");
            }

            //формируем строку запроса
            String insertQuery = "insert into courses (courseName, field, companyName, price, mentor) values (?, ?, ?, ?, ?);";
            //формируем запрос
            PreparedStatement preparedStatement = connection.prepareStatement(insertQuery);
            //заполняем строки value запроса полями объекта
            preparedStatement.setString(1, courseInfo.getCourseName());
            preparedStatement.setString(2, courseInfo.getField());
            preparedStatement.setString(3, courseInfo.getCompanyName());
            preparedStatement.setString(4, courseInfo.getPrice());
            preparedStatement.setString(5, courseInfo.getMentor());
            preparedStatement.execute(); //выполняем запрос
            connection.close(); // закрываем соединение
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            System.out.println("Connection failed");
        }
    }

    //Прочитать записи из БД
    public HashMap<String,CourseInfo> Read() throws ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        HashMap<String, CourseInfo> allCourses = new HashMap<>(); //HashMap для хранения всех записей из БД

        try {
            String selectQuery = "select * from courses;";
            Connection connection = DriverManager.getConnection(url, "root", "2500");
            //формируем запрос
            PreparedStatement preparedStatement = connection.prepareStatement(selectQuery);
            //выполняем запрос и помещаем полученные записи в result
            ResultSet resultSelect = preparedStatement.executeQuery();

            //для всех полей таблицы
            int i=0;
            while (resultSelect.next()) {
                CourseInfo courseInfo = new CourseInfo();
                //формируем объект
                courseInfo.setId(resultSelect.getString("id"));
                courseInfo.setCourseName(resultSelect.getString("courseName"));
                courseInfo.setField(resultSelect.getString("field"));
                courseInfo.setCompanyName(resultSelect.getString("companyName"));
                courseInfo.setPrice(resultSelect.getString("price"));
                courseInfo.setMentor(resultSelect.getString("mentor"));
                //помещаем объект в HashMap
                allCourses.put(Integer.toString(i), courseInfo);
                i++;
            }
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return allCourses; //возвращаем HashMap с объектами
    }

    //Обновить запись в БД
    public void Update(CourseInfo courseInfo) throws ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try {
            //изменить информацию для записи с id = courseInfo.getId()
            String updateQuery = "update courses set courseName = ?, field = ?, companyName = ?, price = ?, mentor = ? where id = ?;";
            Connection connection = DriverManager.getConnection(url, "root", "2500"); // получаем соединение с БД
            PreparedStatement preparedStatement = connection.prepareStatement(updateQuery);
            preparedStatement.setString(1, courseInfo.getCourseName());
            preparedStatement.setString(2, courseInfo.getField());
            preparedStatement.setString(3, courseInfo.getCompanyName());
            preparedStatement.setString(4, courseInfo.getPrice());
            preparedStatement.setString(5, courseInfo.getMentor());
            preparedStatement.setString(6, courseInfo.getId());
            preparedStatement.execute();
            connection.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    //Удалить записи из БД
    public void Delete(String courseId) throws ClassNotFoundException
    {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try{
            //удалить запись с id = courseId
            String deleteQuery = "delete from courses where id = ?;";
            Connection connection = DriverManager.getConnection(url, "root", "2500");
            PreparedStatement preparedStatement = connection.prepareStatement(deleteQuery);
            preparedStatement.setString(1, courseId);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
