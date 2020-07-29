import java.io.Serializable;

public class CourseInfo implements Serializable {
    private String id;
    private String courseName;
    private String field;
    private String companyName;
    private String price;
    private String mentor;

    //Пустой конструктор
    public CourseInfo() {}

    public CourseInfo(String id, String courseName, String field, String companyName, String price, String mentor) {
        this.id = id;
        this.courseName = courseName;
        this.field = field;
        this.companyName = companyName;
        this.price = price;
        this.mentor = mentor;
    }

    public String getId(){ return id; } //получение значения поля
    public void setId(String id){ this.id = id; }

    public String getCourseName(){ return courseName; }
    public void setCourseName(String courseName){ this.courseName = courseName; }

    public String getField(){ return field; }
    public void setField(String field){ this.field = field; }

    public String getCompanyName(){ return companyName; }
    public void setCompanyName(String companyName){ this.companyName = companyName; }

    public String getPrice(){ return price; }
    public void setPrice(String price){ this.price = price; }

    public String getMentor(){ return mentor; }
    public void setMentor(String mentor){ this.mentor = mentor; }
}
