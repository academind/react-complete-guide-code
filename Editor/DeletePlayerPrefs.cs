using UnityEngine;
using UnityEditor;

public class DeletePlayerPrefs : Editor {

	[MenuItem("Window/Delete PlayerPrefs")]
    static void DeletePrefs(){
		if(EditorUtility.DisplayDialog("Delete PlayerPrefs", "Are you sure you want to delete all PlayerPrefs?", "Yes", "No"))
			PlayerPrefs.DeleteAll();
    }
}
