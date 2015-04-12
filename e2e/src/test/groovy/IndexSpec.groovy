import spock.lang.*

import org.finra.jtaf.ewd.ExtWebDriver;
import org.finra.jtaf.ewd.session.SessionManager;
import org.finra.jtaf.ewd.widget.IButton;
import org.finra.jtaf.ewd.widget.element.html.Button;

class IndexSpec extends Specification {
  def "Ensure proper title"() {
    ExtWebDriver ewd = SessionManager.getInstance().getNewSession("client", "client.properties")
    ewd.open("http://localhost:3000")

    expect:
    ewd.getTitle() == "Justin Ho"
  }
}
