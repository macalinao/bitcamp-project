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
    b.waitForElementPresent()
    b.click()

    expect:
    ewd.getTitle() == "InvestorWatch - Verify the integrity of investment advisors"
  }

  def "Ensure proper title advisors"() {
    setup:
    ewd.open("http://localhost:3000/#/advisors")

    expect:
    ewd.getTitle() == "Best and Worst Advisors"
  }

  def "Ensure proper title companies"() {
    setup:
    ewd.open("http://localhost:3000/#/companies")

    expect:
    ewd.getTitle() == "Best and Worst Companies"
  }
}
