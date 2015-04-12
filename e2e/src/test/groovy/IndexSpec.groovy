import spock.lang.*

import org.finra.jtaf.ewd.ExtWebDriver;
import org.finra.jtaf.ewd.session.SessionManager;
import org.finra.jtaf.ewd.widget.IButton;
import org.finra.jtaf.ewd.widget.element.html.Button;

class IndexSpec extends Specification {
  @Shared ewd

  def setupSpec() {
    ewd = SessionManager.getInstance().getNewSession("client", "client.properties")
  }

  def cleanupSpec() {
    ewd.close()
  }

  def "Ensure proper title"() {
    setup:
    ewd.open("http://localhost:3000")

    expect:
    ewd.getTitle() == "InvestorWatch - Verify the integrity of investment advisors"
  }

  def "Comparison doesn't move pages if investors aren't set"() {
    setup:
    ewd.open("http://localhost:3000")

    IButton b = new Button("//*[contains(@class,'btn') and text()='Compare advisors']");

    expect:
    ewd.getTitle() == "InvestorWatch - Verify the integrity of investment advisors"
  }
}
