using System.Collections;
using UnityEngine;

#if UNITY_ADS
using UnityEngine.Advertisements;

public class AdManager : MonoBehaviour {
    
	public string gameId = "1234567";
	
	[Space(15)]
    public bool banner;
	public bool interstitial;
	
	private static AdManager instance;

    void Awake(){
		CheckInstance();
		
        Advertisement.Initialize(gameId);
		
		if(banner)
			StartCoroutine(ShowBannerWhenReady());
    }

    IEnumerator ShowBannerWhenReady(){
        while(!Advertisement.IsReady("banner")){
            yield return new WaitForSeconds(0.5f);
        }
		
        Advertisement.Banner.Show("banner");
    }
	
	public void Interstitial(){
		if(!Advertisement.IsReady("video") || !interstitial)
            return;
		
        Advertisement.Show("video");
	}
	
	void CheckInstance(){
		if(instance == null){
            instance = this;
		}
		else{
            Destroy(gameObject);
		}
		
        DontDestroyOnLoad(this.gameObject);
	}
}

#else
public class AdManager : MonoBehaviour {
}

#endif
